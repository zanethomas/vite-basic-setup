import { BaseObserver } from "@powersync/web";
import { createClient } from "@supabase/supabase-js";

export class SupabaseConnector extends BaseObserver {
  constructor(config) {
    super();
    this.config = config;
    this.client = createClient(
      this.config.supabaseUrl,
      this.config.supabaseAnonKey,
      {
        auth: {
          persistSession: true,
        },
      }
    );
    this.currentSession = null;
    this.ready = false;
  }

  async fetchCredentials() {
    console.log("fetching credentials");
    const {
      data: { session },
      error,
    } = await this.client.auth.getSession();

    if (!session || error) {
      throw new Error(`Could not fetch Supabase credentials: ${error}`);
    }

    console.log("session expires at", session.expires_at);

    const credentials = {
      endpoint: this.config.powersyncUrl,
      token: session.access_token ?? "",
      expiresAt: session.expires_at
        ? new Date(session.expires_at * 1000)
        : undefined,
    };
    console.log("credentials", credentials);
    return credentials;
  }

  async uploadData(database) {
    const transaction = await database.getNextCrudTransaction();

    if (!transaction) {
      return;
    }

    let lastOp = null;
    try {
      // Note: If transactional consistency is important, use database functions
      // or edge functions to process the entire transaction in a single call.
      for (const op of transaction.crud) {
        lastOp = op;
        const table = this.client.from(op.table);
        let result;
        switch (op.op) {
          case "PUT":
            const record = { ...op.opData, id: op.id };
            result = await table.upsert(record);
            break;
          case "PATCH":
            result = await table.update(op.opData).eq("id", op.id);
            break;
          case "DELETE":
            result = await table.delete().eq("id", op.id);
            break;
        }

        if (result.error) {
          console.error(result.error);
          throw new Error(
            `Could not update Supabase. Received error: ${result.error.message}`
          );
        }
      }

      await transaction.complete();
    } catch (ex) {
      console.debug(ex);
      if (
        typeof ex.code == "string" &&
        FATAL_RESPONSE_CODES.some((regex) => regex.test(ex.code))
      ) {
        /**
         * Instead of blocking the queue with these errors,
         * discard the (rest of the) transaction.
         *
         * Note that these errors typically indicate a bug in the application.
         * If protecting against data loss is important, save the failing records
         * elsewhere instead of discarding, and/or notify the user.
         */
        console.log(`Data upload error - discarding ${lastOp}`, ex);
        await transaction.complete();
      } else {
        // Error may be retryable - e.g. network error or temporary server error.
        // Throwing an error here causes this call to be retried after a delay.
        throw ex;
      }
    }
  }

  async loginAnon() {
    const {
      data: { session },
      error,
    } = await this.client.auth.signInAnonymously();

    if (error) {
      throw error;
    }

    this.updateSession(session);
  }

  updateSession(session) {
    this.currentSession = session;
    if (!session) {
      return;
    }
    this.iterateListeners((cb) => cb.sessionStarted?.(session));
  }
}
