import type { Post } from "@/posts/posts.schema.ts";
import type { User } from "@/user/user.schema.ts";
import PostContent from "./PostContent.tsx";

interface PostsProps {
  posts: Post[];
  user?: User;
}

const Posts = ({ posts, user }: PostsProps) => {
  return (
    <>
      {posts.map((post) => <PostContent post={post} user={user} />)}
    </>
  );
};

export default Posts;
