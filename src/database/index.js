import { PowerSyncDatabase } from "@powersync/web";
import { schema } from "./schema";

let PowerSync;
let Supabase;

const create = async (config) => {
  console.log("Creating PowerSyncDatabase");
  PowerSync = new PowerSyncDatabase({
    schema,
    database: {
      dbFilename: config.dbFilename,
    },
  });
  await PowerSync.initialize();
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
  Supabase = new config.connector(config);
  Supabase.init();
//   PowerSync.init();
  await PowerSync.connect(Supabase);
  console.log("connected to supabase");
  console.log("connected to powersync");
};

export const loginAnon = async () => {
  await Supabase.loginAnon();
};

export const openDatabase = async (config) => {
  await create(config);
  await connect(config);
};

export const insertItem = async (text) => {
  // return await Supabase.client.from("list").insert({ text }).select("*");

  return PowerSync.execute(
    "INSERT INTO list(id, text) VALUES(uuid(), ?) RETURNING *",
    [text]
  );
};

export const updateItem = async (id, text) => {
  //   return await Supabase.client.from("list").update({ text }).eq("id", id);

  console.log(PowerSync);
  debugger;
  return PowerSync.execute("UPDATE list SET text = ? WHERE id = ?", [text, id]);
};

export const deleteItem = async (id) => {
  //   return await Supabase.client.from("list").delete().eq("id", id);

  return PowerSync.execute("DELETE FROM list WHERE id = ?", [id]);
};

export const allItems = async () => {
  //   return (await Supabase.client.from("list").select().order('created_at')).data;

  return await PowerSync.getAll("SELECT * FROM list ORDER BY created_at");
};

export const deleteAllItems = async () => {
  // return await Supabase.client
  // .from("list")
  // .delete()
  // .neq("id", "00000000-0000-0000-0000-000000000000");

  return PowerSync.execute("DELETE FROM list");
};
