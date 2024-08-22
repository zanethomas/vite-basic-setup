import { PowerSyncDatabase } from "@powersync/web";
import { schema } from "./schema";

let PowerSync;

const create = (config) => {
  console.log("creating PowerSyncDatabase");
  PowerSync = new PowerSyncDatabase({
    schema,
    database: {
      dbFilename: config.dbFilename,
    },
  });
  console.log("PowerSyncDatabase created");
};

const connect = async (config) => {
  console.log("connecting PowerSyncDatabase");
  await PowerSync.connect(new config.connector(config));
  console.log("PowerSyncDatabase connected");
};

export const openDatabase = async (config) => {
  create(config);
  await connect(config);
};

export const insertItem = async (item) => {
  return PowerSync.execute(
    "INSERT INTO list(id, item) VALUES(uuid(), ?) RETURNING *",
    [item]
  );
};

export const updateItem = async (id, item) => {
  PowerSync.execute("UPDATE list SET item = ? WHERE id = ?", [item, id]);
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
