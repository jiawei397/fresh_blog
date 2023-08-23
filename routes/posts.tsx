import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { getServiceInstance } from "@/modules/tools/utils.ts";
import { State } from "@/modules/session/session.middleware.ts";
import { PostsService } from "@/modules/posts/posts.service.ts";
import Posts from "@/components/Posts.tsx";

export default async function PostsPage(
  req: Request,
  ctx: MiddlewareHandlerContext<State>,
) {
  const session = ctx.state.session;
  const postsService = await getServiceInstance(PostsService);
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const userId = searchParams.get("userId");
  const posts = userId
    ? await postsService.findByUserId(userId, {
      isWithUserInfo: true,
      isWithCommentsCount: true,
    })
    : await postsService.findAll({
      isWithUserInfo: true,
      isWithCommentsCount: true,
    });
  // console.log(posts);
  return <Posts posts={posts} user={session?.user} />;
}
