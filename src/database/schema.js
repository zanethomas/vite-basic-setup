import { column, Schema, TableV2 } from "@powersync/web";

const list = new TableV2({
  created_at: column.text,
  item: column.text,
});

export const schema = new Schema({
  list,
});
 