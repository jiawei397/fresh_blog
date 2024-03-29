import type { User } from "@/modules/user/user.schema.ts";

interface CreatePostProps {
  user: User;
}
const CreatePostForm = ({ user }: CreatePostProps) => {
  return (
    <div class="ui grid">
      <div class="four wide column">
        <a
          class="avatar"
          href={`/posts?userId=${user.id}`}
          data-title={`${user.name} | ${
            ({ m: "男", f: "女", x: "保密" })[user.gender]
          }`}
          data-content={user.bio}
        >
          <img class="avatar" src={`/img/${user.avatar}`} />
        </a>
      </div>

      <div class="eight wide column">
        <form class="ui form segment" method="post" action="/posts/create">
          <div class="field required">
            <label>标题</label>
            <input type="text" name="title" required maxLength={100} />
          </div>
          <div class="field required">
            <label>内容</label>
            <textarea name="content" rows={15} maxLength={1000} required>
            </textarea>
          </div>
          <input type="submit" class="ui button" value="发布" />
        </form>
      </div>
    </div>
  );
};

export default CreatePostForm;
