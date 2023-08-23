const SignInForm = () => {
  return (
    <div class="ui grid">
      <div class="four wide column"></div>
      <div class="eight wide column">
        <form
          class="ui form segment"
          method="post"
          encType="multipart/form-data"
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
