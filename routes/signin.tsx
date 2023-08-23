import Signin from "@/islands/SigninForm.tsx";
import {
  HandlerContext,
  Handlers,
  MiddlewareHandlerContext,
} from "$fresh/server.ts";
import { SigninDto } from "@/user/user.dto.ts";
import { toBack, toHome, validateParams } from "@/tools/utils.ts";
import { logger } from "@/tools/log.ts";
import { UserService } from "@/user/user.service.ts";
import { flash, State } from "@/session/session.middleware.ts";
import { assert } from "$std/assert/mod.ts";

export const handler: Handlers = {
  async POST(req, ctx) {
    const form: FormData = await req.formData();
    const errMsgs = await validateParams(SigninDto, form);
    if (errMsgs.length > 0) {
      flash(ctx, "error", errMsgs.join("\n"));
      return toBack(req);
    }
    const userAgent = req.headers.get("user-agent");
    if (!userAgent) {
      flash(ctx, "error", "user-agent is required");
      return toBack(req);
    }
    logger.debug("登陆参数校验成功");
    const username = form.get("name") as string;
    const password = form.get("password") as string;
    const userService = new UserService();
    await userService.init();
    const user = await userService.findByName(username);
    let error = "";
    if (!user) {
      logger.error(`用户名${username}不存在`);
      error = "用户名或密码错误";
    } else if (password !== user.password) {
      logger.error(`用户${username}的密码${password}不匹配`);
      error = "用户名或密码错误";
    }
    if (error) {
      flash(ctx, "error", error);
      return toBack(req);
    }
    assert(user);
    const userId = user.id;
    flash(ctx, "userId", user.id);
    flash(ctx, "success", "登录成功");
    logger.info(`用户【${userId}】登陆成功`);
    return toHome(req);
  },
};

// deno-lint-ignore require-await
export default async function SigninPage(
  req: Request,
  ctx: HandlerContext<unknown, State>,
) {
  const session = ctx.state.session;
  if (session?.user) {
    flash(ctx, "error", "已登陆");
    return toHome(req);
  }
  return <Signin />;
}
