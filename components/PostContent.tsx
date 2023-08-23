import type { Post } from "@/modules/posts/posts.schema.ts";
import type { User } from "@/modules/user/user.schema.ts";
import { assert } from "$std/assert/mod.ts";

interface PostContentProps {
  post: Post;
  user?: User;
}

const PostContent = ({ post, user }: PostContentProps) => {
  const { author, title, contentHtml, createdAt, pv, commentsCount } = post;
  assert(author);
  const username = author.name;
  const sex = { m: "男", f: "女", x: "保密" }[author?.gender!] || "保密";
  const titleTip = `${username} | ${sex}`;
  const avatar = `/img/${author?.avatar}`;
  const isAdmin = user && author?.id && user.id === author.id;

  return (
    <div class="post-content">
      <div class="ui grid">
        <div class="four wide column">
          <a
            class="avatar"
            href={`/posts?userId=${author.id}`}
            data-title={titleTip}
            data-content={author.bio}
          >
            <img class="avatar" src={avatar} />
          </a>
        </div>

        <div class="eight wide column">
          <div class="ui segment">
            <h3>
              <a href={`/posts/${post.id}`}>{title}</a>
            </h3>
            <pre>{contentHtml}</pre>
            <div>
              <span class="tag">{createdAt}</span>
              <span class="tag right">
                <span>浏览({pv})</span>
                <span>留言({commentsCount})</span>

                {isAdmin && (
                  <div class="ui inline dropdown">
                    <div class="text"></div>
                    <i class="dropdown icon"></i>
                    <div class="menu">
                      <div class="item">
                        <a href={`/posts/${post.id}/edit`}>编辑</a>
                      </div>
                      <div class="item">
                        <a href={`/posts/${post.id}/remove`}>删除</a>
                      </div>
                    </div>
                  </div>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostContent;
