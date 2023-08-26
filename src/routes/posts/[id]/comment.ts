import { Handlers } from "$fresh/server.ts";
import {
  getServiceInstance,
  isMongoId,
  toBack,
  toLogin,
  validateParams,
} from "@/tools/utils.ts";
import { flash, State } from "@/modules/session/session.middleware.ts";
import { logger } from "@/tools/log.ts";
import { CommentsService } from "@/modules/comments/comments.service.ts";
import { CreateCommentDto } from "@/modules/comments/comments.dto.ts";

export const handler: Handlers<unknown, State> = {
  async POST(req, ctx) {
    const session = ctx.state.session;
    const user = session?.user;
    if (!user) {
      return toLogin(req);
    }
    const postId = ctx.params.id;
    if (!isMongoId(postId)) {
      logger.error(`文章id不合法：${postId}`);
      const error = `文章id不合法`;
      return new Response(error, {
        status: 400,
      });
    }
    const commentsService = await getServiceInstance(CommentsService);
    const form: FormData = await req.formData();
    const errMsgs = await validateParams(CreateCommentDto, form);
    if (errMsgs.length > 0) {
      flash(ctx, "error", errMsgs.join("\n"));
      return toBack(req);
    }
    const commentId = await commentsService.create({
      postId,
      userId: user.id!,
      content: form.get("content") as string,
    });
    logger.info(`用户${user.id}创建了博客${postId}的留言: ${commentId}`);
    flash(ctx, "success", "留言成功");
    return toBack(req);
  },
};
