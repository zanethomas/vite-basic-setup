import { column, Schema, TableV2 } from "@powersync/web";

const list = new TableV2(
  {
    // id column (text) is automatically included
    text: column.text,
    created_at: column.text
  },
  { indexes: {} }
);

export const schema = new Schema({
  list
});

