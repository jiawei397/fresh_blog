import { Handlers, RouteConfig } from "$fresh/server.ts";
import {
  getServiceInstance,
  isMongoId,
  toBack,
  toLogin,
} from "@/tools/utils.ts";
import { flash, State } from "@/modules/session/session.middleware.ts";
import { logger } from "@/tools/log.ts";
import { CommentsService } from "@/modules/comments/comments.service.ts";

export const config: RouteConfig = {
  routeOverride: "/posts/:id/comment/:commentId/remove",
};

export const handler: Handlers<unknown, State> = {
  async GET(req, ctx) {
    const { id: postId, commentId } = ctx.params;
    const session = ctx.state.session;
    const user = session?.user;
    if (!user) {
      return toLogin(req);
    }
    if (!isMongoId(postId)) {
      logger.error(`文章id不合法：${postId}`);
      const error = `文章id不合法`;
      return new Response(error, {
        status: 400,
      });
    }
    const commentsService = await getServiceInstance(CommentsService);
    const comment = await commentsService.findById(commentId);
    if (!comment) {
      logger.error(`留言不存在：${commentId}`);
      const error = `留言不存在`;
      return new Response(error, {
        status: 400,
      });
    }
    if (comment.userId !== user.id) {
      logger.error(`用户【${user.id}】无权限删除留言：${commentId}`);
      const error = `无权限删除留言`;
      return new Response(error, {
        status: 403,
      });
    }
    if (comment.postId !== postId) {
      logger.error(`留言${commentId} 不属于 postId${postId}`);
      const error = `留言不属于该文章`;
      return new Response(error, {
        status: 400,
      });
    }
    await commentsService.deleteById(commentId);
    logger.info(`用户【${user.id}】删除留言成功: ${commentId}`);
    flash(ctx, "success", "删除留言成功");
    return toBack(req);
  },
};
