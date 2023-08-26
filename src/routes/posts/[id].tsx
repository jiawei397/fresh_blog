import { HandlerContext } from "$fresh/server.ts";
import { getServiceInstance, isMongoId, toLogin } from "@/tools/utils.ts";
import { State } from "@/modules/session/session.middleware.ts";
import { PostsService } from "@/modules/posts/posts.service.ts";
import Post from "@/components/PostContent.tsx";
import Comments from "@/components/Comments.tsx";
import { logger } from "@/tools/log.ts";

export default async function PostPage(
  req: Request,
  ctx: HandlerContext<unknown, State>,
) {
  const session = ctx.state.session;
  if (!session?.user) {
    return toLogin(req);
  }
  const id = ctx.params.id;
  if (!isMongoId(id)) {
    logger.error(`文章id不合法：${id}`);
    const error = `文章id不合法`;
    return new Response(error, {
      status: 400,
    });
  }

  const postsService = await getServiceInstance(PostsService);
  const post = await postsService.findById(id, {
    isWithUserInfo: true,
    isIncrementPv: true,
    isWithComments: true,
  });
  if (!post) {
    logger.error(`文章未找到：${id}`);
    const error = `文章未找到`;
    return new Response(error, {
      status: 400,
    });
  }
  return (
    <>
      <Post post={post} user={session.user} />
      <Comments post={post} user={session.user} />
    </>
  );
}
