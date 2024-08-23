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

  async init() {
    if (this.ready) {
      return;
    }

    const sessionResponse = await this.client.auth.getSession();
    this.updateSession(sessionResponse.data.session);

    this.ready = true;
    this.iterateListeners((cb) => cb.initialized?.());
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
