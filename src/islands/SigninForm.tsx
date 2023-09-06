import { error, success } from "@/client/messages.ts";
import { delay } from "$std/async/delay.ts";

const SignInForm = () => {
  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const res = await fetch("/signin", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      error(await res.text());
      return;
    }
    const user = await res.json();
    let timeLeft = 3;
    const handleRedirect = async () => {
      for (let i = 0; i < 3; i++) {
        success(`欢迎回来：${user.name}，页面将在${timeLeft}秒后跳转`);
        await delay(1000);
        timeLeft--;
      }
    };
    await handleRedirect();
    // 注册成功后跳转到登录页面
    location.href = "/posts";
  };
  return (
    <div class="ui grid">
      <div class="four wide column"></div>
      <div class="eight wide column">
        <form
          class="ui form segment"
          method="post"
          encType="multipart/form-data"
          onSubmit={handleSubmit}
          action="/signin"
        >
          <div class="field required">
            <label>用户名</label>
            <input
              placeholder="用户名"
              type="text"
              name="name"
              minLength={1}
              maxLength={10}
              required
            />
          </div>
          <div class="field required">
            <label>密码</label>
            <input
              placeholder="密码"
              type="password"
              name="password"
              minLength={6}
              maxLength={20}
              required
            />
          </div>
          <input type="submit" class="ui button fluid" value="登录" />
        </form>
      </div>
    </div>
  );
};

export default SignInForm;
