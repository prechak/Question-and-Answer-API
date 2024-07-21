import { readFile } from "fs/promises";

export async function loadSwaggerDocument() {
  const swaggerDocument = JSON.parse(
    await readFile(new URL("../swagger-output.json", import.meta.url))
  );
  return swaggerDocument;
}
