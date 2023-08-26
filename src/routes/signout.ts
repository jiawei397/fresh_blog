import { Handlers } from "$fresh/server.ts";
import { toHome } from "@/tools/utils.ts";
import { flash, State } from "@/modules/session/session.middleware.ts";

export const handler: Handlers<unknown, State> = {
  GET(req, ctx) {
    const session = ctx.state.session;
    if (!session?.user) {
      return toHome(req);
    }
    flash(ctx, "userId", "");
    flash(ctx, "success", "登出成功");
    return toHome(req);
  },
};
