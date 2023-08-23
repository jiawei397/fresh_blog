import { getLogger, initLog } from "date_file_log";
import globals from "../globals.ts";

await initLog(globals.log);

export const logger = getLogger();
