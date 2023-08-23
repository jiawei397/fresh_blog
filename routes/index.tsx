import { toHome } from "@/tools/utils.ts";

// deno-lint-ignore require-await
export default async function Home(req: Request) {
  return toHome(req, 301);
}
