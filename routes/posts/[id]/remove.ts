import { HandlerContext, Handlers, RouteConfig } from "$fresh/server.ts";
import {
  getServiceInstance,
  isMongoId,
  toBack,
  toLogin,
  toPage,
} from "@/modules/tools/utils.ts";
import { flash, State } from "@/modules/session/session.middleware.ts";
import { PostsService } from "@/modules/posts/posts.service.ts";
import { logger } from "@/modules/tools/log.ts";

export const handler: Handlers<unknown, State> = {
  async GET(req, ctx) {
    const session = ctx.state.session;
    const user = session?.user;
    if (!user) {
      return toLogin(req);
    }
    const postsService = await getServiceInstance(PostsService);
    const id = ctx.params.id;
    if (!isMongoId(id)) {
      logger.error(`文章id不合法：${id}`);
      const error = `文章id不合法`;
      return new Response(error, {
        status: 400,
      });
    }
    const post = await postsService.findById(id);
    if (!post) {
      logger.error(`文章未找到：${id}`);
      const error = `文章未找到`;
      return new Response(error, {
        status: 400,
      });
    }
    if (post.userId !== user.id) {
      logger.error(`用户【${user.id}】无权限删除文章：${id}`);
      const error = `无权限删除文章`;
      return new Response(error, {
        status: 403,
      });
    }
    try {
      await postsService.deleteById(id);
      const userId = user.id;
      flash(ctx, "success", "删除成功");
      logger.info(`用户【${userId}】删除文章成功: ${id}, ${post.title}`);
      return toPage(req, `/posts`);
    } catch (error) {
      logger.error(
        `用户【${user.id}】删除文章失败: ${id}, ${post.title}, error: ${error}`,
      );
      flash(ctx, "error", error);
      return toBack(req);
    }
  },
};
