import type { Post } from "@/modules/posts/posts.schema.ts";
import type { User } from "@/modules/user/user.schema.ts";

interface ContentsProps {
  post: Post;
  user?: User;
}

const renderComments = ({ post, user }: ContentsProps) => {
  if (!post.comments) return null;
  return post.comments.map((comment) => {
    const { id, author, createdAt, contentHtml } = comment;

    const renderActions = () => {
      if (user && author?.id && user.id === author.id) {
        return (
          <div class="actions">
            <a class="reply" href={`/posts/${post.id}/comment/${id}/remove`}>
              删除
            </a>
          </div>
        );
      }
      return null;
    };

    return (
      <div class="comment">
        <span class="avatar">
          <img src={`/img/${author.avatar}`} />
        </span>
        <div class="content">
          <a class="author" href={`/posts?userId=${author.id}`}>
            {author.name}
          </a>
          <div class="metadata">
            <span class="date">{createdAt}</span>
          </div>
          <div
            class="text"
            dangerouslySetInnerHTML={{ __html: contentHtml || "" }}
          >
          </div>
          {renderActions()}
        </div>
      </div>
    );
  });
};

const Comments = ({ post, user }: ContentsProps) => {
  return (
    <div class="ui grid">
      <div class="four wide column"></div>
      <div class="eight wide column">
        <div class="ui segment">
          <div class="ui minimal comments">
            <h3 class="ui dividing header">留言</h3>
            {renderComments({ post, user })}
            {user && (
              <form
                class="ui reply form"
                method="post"
                action={`/posts/${post.id}/comment`}
              >
                <div class="field">
                  <textarea name="content"></textarea>
                </div>
                <input type="submit" class="ui icon button" value="留言" />
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comments;
