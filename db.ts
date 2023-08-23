import { MongoFactory } from "deno_mongo_schema";
import globals from "./globals.ts";

await MongoFactory.forRoot(globals.db);
