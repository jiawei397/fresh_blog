import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { getServiceInstance, toPage } from "@/tools/utils.ts";
import { State } from "@/session/session.middleware.ts";
import { PostsService } from "@/posts/posts.service.ts";
import Posts from "@/components/Posts.tsx";

export default async function PostPage(
  req: Request,
  ctx: MiddlewareHandlerContext<State>,
) {
  const session = ctx.state.session;
  if (!session?.user) {
    return toPage(req, "/signin");
  }
  const postsService = await getServiceInstance(PostsService);
  const posts = await postsService.findAll({
    isWithUserInfo: true,
    isWithCommentsCount: true,
  });
  // console.log(posts);
  return <Posts posts={posts} user={session.user} />;
}
