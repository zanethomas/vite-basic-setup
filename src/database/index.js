import { PowerSyncDatabase } from "@powersync/web";
import { schema } from "./schema";

let PowerSync;
let Supabase;

const create = (config) => {
  console.log("Creating PowerSyncDatabase");
  PowerSync = new PowerSyncDatabase({
    schema,
    database: {
      dbFilename: config.dbFilename,
    },
  });
  console.log("PowerSyncDatabase Created");
};

export const connect = async (config) => {
  console.log("connecting to powersync ...");
  PowerSync = new PowerSyncDatabase({
    schema,
    database: {
      dbFilename: config.dbFilename,
    },
  });
  console.log("connecting to supabase ...");

  await PowerSync.connect(Supabase = new config.connector(config));
  await PowerSync.waitForFirstSync().then(() => {
	 console.log("First sync done");
  });

  console.log("connected to supabase");
  console.log("connected to powersync");
};

export const loginAnon = async () => {
  await Supabase.loginAnon();
};

export const openDatabase = async (config) => {
  create(config);
  await connect(config);
};

export const insertItem = async (text) => {
  return PowerSync.execute(
    "INSERT INTO list(id, text) VALUES(uuid(), ?) RETURNING *",
    [text]
  );
};

export const updateItem = async (id, text) => {
  return PowerSync.execute("UPDATE list SET text = ? WHERE id = ?", [text, id]);
};

export const deleteItem = async (id) => {
  return PowerSync.execute("DELETE FROM list WHERE id = ?", [id]);
};

export const allItems = async () => {
  return await PowerSync.getAll("SELECT * FROM list ORDER BY created_at");
};

export const deleteAllItems = async () => {
  return PowerSync.execute("DELETE FROM list");
};
