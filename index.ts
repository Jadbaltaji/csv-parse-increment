import { BunFile } from "bun";
import * as readline from "readline/promises";
import { z } from "zod";

// Ask user for input

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const readCSV = async (filePath: string): Promise<BunFile> => {
  const path = filePath.trim().replace(/^["']+|["']+$/g, "");
  const file = await Bun.file(path);
  if (!file) {
    throw new Error("The file does not exist at the specified path.");
  }

  if (file.type !== "text/csv") {
    throw new Error("The file must be a .csv file.");
  }

  return file;
};

const path = await rl.question("Please enter the path to the CSV file: ");

const csv = await readCSV(path);
console.log(`CSV: ${csv.name?.split("/home/jad/bun-demo/assets/").join("")}`);

const csvText = await csv.text();
const schema = z
  .string()
  .transform((value) => value.split("\n").map((row) => row.split(",")))
  .transform((value) =>
    value.map((row) => {
      const element = Number(row?.[0]);
      return !Number.isNaN(element) ? [element + 1, ...row.slice(1)] : row;
    })
  )
  .transform((value) => value.map((row) => row.join(",")).join("\n"));

const updatedRows = schema.parse(csvText);

Bun.write(`./assets/updated-${new Date().getTime()}.csv`, updatedRows);
