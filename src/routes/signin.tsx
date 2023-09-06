import Signin from "@/islands/SigninForm.tsx";
import { HandlerContext, Handlers } from "$fresh/server.ts";
import { SigninDto } from "@/modules/user/user.dto.ts";
import {
  badResponse,
  getServiceInstance,
  toHome,
  validateParams,
} from "@/tools/utils.ts";
import { logger } from "@/tools/log.ts";
import { UserService } from "@/modules/user/user.service.ts";
import { flash, State } from "@/modules/session/session.middleware.ts";
import { assert } from "$std/assert/mod.ts";
import { Cookie, setCookie } from "$std/http/cookie.ts";
import { SESSION_KEY } from "@/modules/session/session.schema.ts";
import { SessionService } from "@/modules/session/session.service.ts";

export const handler: Handlers = {
  async POST(req, ctx) {
    const form: FormData = await req.formData();
    const errMsgs = await validateParams(SigninDto, form);
    if (errMsgs.length > 0) {
      return badResponse(errMsgs.join("\n"));
    }
    const userAgent = req.headers.get("user-agent");
    if (!userAgent) {
      return badResponse("user-agent is required");
    }
    logger.debug("登陆参数校验成功");
    const username = form.get("name") as string;
    const password = form.get("password") as string;
    const userService = await getServiceInstance(UserService);
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
      return badResponse(error);
    }
    assert(user);
    const userId = user.id;
    logger.info(`用户【${userId}】登陆成功`);
    // 响应Cookie
    const sessionService = await getServiceInstance(SessionService);
    const session = await sessionService.save({ userAgent, userId });
    const sessionId = session.id!;
    const headers = new Headers();
    const cookie: Cookie = {
      name: SESSION_KEY,
      value: sessionId,
      httpOnly: true,
      secure: false,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "Strict",
    };
    setCookie(headers, cookie);
    headers.set("content-type", "application/json");
    return new Response(JSON.stringify(user), {
      headers,
    });
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
