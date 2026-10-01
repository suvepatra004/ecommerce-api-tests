import Ajv from "ajv";
import { readFileSync } from "fs";
import { join } from "path";

const ajv = new Ajv();

export function loadSchema(schemaFileName) {
  const schemaPath = join(process.cwd(), "schemas", schemaFileName);
  return JSON.parse(readFileSync(schemaPath, "utf-8"));
}

export function validateSchema(data, schema) {
  const validate = ajv.compile(schema);
  const valid = validate(data);
  return { valid, errors: validate.errors };
}
