import { object, optional, string } from 'valibot';

export const schemaCardConfig = object({
  colour: optional(string())
});
