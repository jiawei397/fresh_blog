import { HandlerContext, Handlers, RouteConfig } from "$fresh/server.ts";
import {
  getServiceInstance,
  toBack,
  toLogin,
  toPage,
  validateParams,
} from "@/tools/utils.ts";
import { flash, State } from "@/modules/session/session.middleware.ts";
import { PostsService } from "@/modules/posts/posts.service.ts";
import { logger } from "@/tools/log.ts";
import { UpdatePostDto } from "@/modules/posts/posts.dto.ts";
import EditPostForm from "@/components/posts/Edit.tsx";

export const handler: Handlers<unknown, State> = {
  async POST(req, ctx) {
    const session = ctx.state.session;
    const user = session?.user;
    if (!user) {
      return toLogin(req);
    }
    const form: FormData = await req.formData();
    const errMsgs = await validateParams(UpdatePostDto, form);
    if (errMsgs.length > 0) {
      flash(ctx, "error", errMsgs.join("\n"));
      return toBack(req);
    }
    logger.debug("更新博客校验成功");
    const title = form.get("title") as string;
    const content = form.get("content") as string;
    const postsService = await getServiceInstance(PostsService);
    const id = ctx.params.id;
    const post = await postsService.findById(id, {
      isWithUserInfo: false,
    });
    if (!post) {
      const error = `文章不存在`;
      flash(ctx, "error", error);
      return toBack(req);
    }
    if (post.userId !== user.id) {
      logger.error(`用户【${user.id}】无权限更新文章：${id}`);
      const error = `无权限更新文章`;
      return new Response(error, {
        status: 403,
      });
    }
    try {
      await postsService.update(id, {
        title,
        content,
      });
      const userId = user.id;
      flash(ctx, "success", "更新成功");
      logger.info(`用户【${userId}】更新文章成功: ${title}`);
      return toPage(req, `/posts/${id}`);
    } catch (error) {
      logger.error(`用户【${user.id}】更新文章失败: ${title}, error: ${error}`);
      flash(ctx, "error", error);
      return toBack(req);
    }
  },
};

export default async function EditPostPage(
  req: Request,
  ctx: HandlerContext<unknown, State>,
) {
  const session = ctx.state.session;
  if (!session?.user) {
    return toLogin(req);
  }
  const postsService = await getServiceInstance(PostsService);
  const id = ctx.params.id;
  const post = await postsService.findById(id, {
    isWithUserInfo: false,
  });
  if (!post) {
    const error = `文章不存在`;
    flash(ctx, "error", error);
    return toBack(req);
  }

  return (
    <>
      <EditPostForm user={session.user} post={post} />
    </>
  );
}
