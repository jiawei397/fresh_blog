import type { User } from "@/user/user.schema.ts";

interface NavSettingProps {
  user?: User;
}

export function NavSetting(props: NavSettingProps) {
  const user = props.user;
  return (
    <div class="nav-setting">
      <div class="ui buttons">
        <div class="ui floating dropdown button">
          <i class="icon bars"></i>
          <div class="menu">
            {user
              ? (
                <>
                  <a class="item" href={`/posts?userId=${user.id}`}>个人主页</a>
                  <div class="divider"></div>
                  <a class="item" href="/posts/create">发表文章</a>
                  <a class="item" href="/signout">退出登陆</a>
                </>
              )
              : (
                <>
                  <a class="item" href="/signin">登陆</a>
                  <a class="item" href="/signup">注册</a>
                </>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
