const SignUpForm = () => {
  return (
    <div class="ui grid">
      <div class="four wide column"></div>
      <div class="eight wide column">
        <form
          class="ui form segment"
          method="post"
          encType="multipart/form-data"
          action="/signup"
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
          <div class="field required">
            <label>重复密码</label>
            <input
              placeholder="重复密码"
              type="password"
              name="repassword"
              minLength={6}
              maxLength={20}
              required
            />
          </div>
          <div class="field required">
            <label>性别</label>
            <select class="ui compact selection dropdown" name="gender">
              <option value="m">男</option>
              <option value="f">女</option>
              <option value="x">保密</option>
            </select>
          </div>
          <div class="field required">
            <label>头像</label>
            <input type="file" name="avatar" required />
          </div>
          <div class="field required">
            <label>个人简介</label>
            <textarea name="bio" rows={5} required minLength={1} maxLength={30}>
            </textarea>
          </div>
          <input type="submit" class="ui button fluid" value="注册" />
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
