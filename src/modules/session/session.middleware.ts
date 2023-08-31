import { HandlerContext, MiddlewareHandlerContext } from "$fresh/server.ts";
import { logger } from "@/tools/log.ts";
import { Session, SESSION_KEY } from "./session.schema.ts";
import { SessionService } from "./session.service.ts";
import { Cookie, getCookies, setCookie } from "$std/http/cookie.ts";
import { getServiceInstance } from "@/tools/utils.ts";

export interface Notification {
  success?: string;
  error?: string;
  userId?: string;
}

export interface State {
  session?: Session;
  notification?: Notification;
}

export const flash = (
  context: HandlerContext<unknown, State>,
  key: keyof Notification,
  val: string,
) => {
  if (!context.state.notification) {
    context.state.notification = {};
  }
  context.state.notification[key] = val;
};

export async function SessionMiddleware(
  req: Request,
  context: MiddlewareHandlerContext<State>,
) {
  if (context.destination !== "route") {
    return context.next();
  }
  const currentUserAgent = req.headers.get("user-agent");
  if (!currentUserAgent) {
    logger.warn(`没有找到user-agent`);
    return context.next();
  }

  const sessionService = await getServiceInstance(SessionService);
  // 从request中获取cookies的sessionId
  const cookieMap = getCookies(req.headers);
  let sessionId = cookieMap[SESSION_KEY];
  let session;
  if (sessionId) {
    session = await sessionService.findById(sessionId, true).catch((_err) =>
      null
    );
    if (!session) {
      logger.warn(`没有找到session: ${sessionId}`);
    } else {
      if (session.userAgent && session.userAgent !== currentUserAgent) {
        logger.warn(
          `session: ${sessionId} 的userAgent不匹配，期望值：${session.userAgent}，实际值：${currentUserAgent}`,
        );
        session = null;
      }
    }
  } else {
    logger.warn(`cookie中没有找到${SESSION_KEY}`);
  }
  if (!session) {
    session = await sessionService.save({ userAgent: currentUserAgent });
    sessionId = session.id!;
    logger.info(`创建session: ${sessionId}`);
  }
  context.state.session = session;
  const res = await context.next();

  const headers = new Headers(res.headers);
  const cookie: Cookie = {
    name: SESSION_KEY,
    value: sessionId,
    httpOnly: true,
    secure: false,
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "Strict",
  };
  setCookie(headers, cookie);

  const { success, error, userId } = context.state.notification || {};
  if (success || error || userId !== undefined) {
    await sessionService.update({
      id: sessionId,
      ...context.state.notification, // 不能随意传递undefined，否则会覆盖原有的值
    });
    return new Response(res.body, {
      status: res.status,
      headers,
    });
  } else {
    if (session.error || session.success) {
      await sessionService.update({
        id: sessionId,
        error: "",
        success: "",
      });
      return new Response(res.body, {
        status: res.status,
        headers,
      });
    }
  }
  return res;
}
