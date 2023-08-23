import { HandlerContext, Handlers } from "$fresh/server.ts";
import {
  getServiceInstance,
  toBack,
  toLogin,
  toPage,
  validateParams,
} from "@/modules/tools/utils.ts";
import { flash, State } from "@/modules/session/session.middleware.ts";
import { PostsService } from "@/modules/posts/posts.service.ts";
import { logger } from "@/modules/tools/log.ts";
import CreatePostForm from "@/components/posts/Create.tsx";
import { CreatePostDto } from "@/modules/posts/posts.dto.ts";

export const handler: Handlers<unknown, State> = {
  async POST(req, ctx) {
    const session = ctx.state.session;
    const user = session?.user;
    if (!user) {
      return toLogin(req);
    }
    const form: FormData = await req.formData();
    const errMsgs = await validateParams(CreatePostDto, form);
    if (errMsgs.length > 0) {
      flash(ctx, "error", errMsgs.join("\n"));
      return toBack(req);
    }
    logger.debug("创建博客校验成功");
    const title = form.get("title") as string;
    const content = form.get("content") as string;
    const postsService = await getServiceInstance(PostsService);
    try {
      const id = await postsService.save({
        title,
        content,
        userId: user.id!,
      });
      const userId = user.id;
      flash(ctx, "success", "发表成功");
      logger.info(`用户【${userId}】发表文章成功: ${id}, ${title}`);
      return toPage(req, `/posts/${id}`);
    } catch (error) {
      logger.error(`用户【${user.id}】发表文章失败: ${title}, error: ${error}`);
      flash(ctx, "error", error);
      return toBack(req);
    }
  },
};

// deno-lint-ignore require-await
export default async function CreatePostPage(
  req: Request,
  ctx: HandlerContext<unknown, State>,
) {
  const session = ctx.state.session;
  if (!session?.user) {
    return toLogin(req);
  }

  return (
    <>
      <CreatePostForm user={session.user} />
    </>
  );
}
