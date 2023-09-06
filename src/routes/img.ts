import { HandlerContext, RouteConfig } from "$fresh/server.ts";

export const config: RouteConfig = {
  routeOverride: "/img/:path*",
};

export const handler = {
  async GET(_req: Request, { params }: HandlerContext) {
    const { path } = params;
    try {
      const file = await Deno.readFile(`./img/${path}`);
      return new Response(file);
    } catch (_error) {
      return new Response("Not Found", { status: 404 });
    }
  },
};
