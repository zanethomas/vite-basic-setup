import { PowerSyncDatabase } from "@powersync/web";
import { schema } from "./schema";

let PowerSync;

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

export const openDatabase = async (config) => {
  create(config);
};

export const insertItem = async (text) => {
  return PowerSync.execute(
    "INSERT INTO list(id, text) VALUES(uuid(), ?) RETURNING *",
    [text]
  );
};

export const updateItem = async (id, text) => {
  PowerSync.execute("UPDATE list SET text = ? WHERE id = ?", [text, id]);
};

export const deleteItem = async (id) => {
  PowerSync.execute("DELETE FROM list WHERE id = ?", [id]);
};

export const allItems = async () => {
  return PowerSync.getAll("SELECT * FROM list");
};

export const deleteAllItems = async () => {
  PowerSync.execute("DELETE FROM list");
};
