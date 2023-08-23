import Signup from "@/islands/SignupForm.tsx";
import { Handlers } from "$fresh/server.ts";
import { toBack, validateParams } from "../tools/utils.ts";
import { CreateUserDto } from "../user/user.dto.ts";
import { logger } from "../tools/log.ts";
import { UserService } from "../user/user.service.ts";
import { Gender } from "../user/user.schema.ts";
import { nanoid } from "nanoid";
import { flash } from "@/session/session.middleware.ts";

export const handler: Handlers = {
  async POST(req, ctx) {
    const form: FormData = await req.formData();
    const avatar = form.get("avatar") as File;
    if (!avatar) {
      return new Response("必须上传头像", {
        status: 400,
      });
    }
    const errMsgs = await validateParams(CreateUserDto, form);
    if (errMsgs.length > 0) {
      return new Response(errMsgs.join("\n"), {
        status: 400,
      });
    }
    if (form.get("password") !== form.get("repassword")) {
      return new Response("两次输入密码不一致", {
        status: 400,
      });
    }
    logger.debug("注册参数校验成功");
    // 写入上传的avatar到static/img目录
    const originFilename = avatar.name;
    const ext = originFilename.split(".").pop();
    const filename = nanoid() + "." + ext; // 为避免用户上传的文件重名，所以不能使用原始名称avatar.name，而是用一个唯一值
    await Deno.mkdir("static/img").catch((_err) => null);
    await Deno.writeFile("static/img/" + filename, avatar.stream());
    logger.debug(`上传图片成功`);

    // 将用户信息写入数据库
    const userService = new UserService();
    await userService.init();
    let id: string;
    try {
      id = await userService.addUser({
        name: form.get("name") as string,
        password: form.get("password") as string,
        gender: form.get("gender") as Gender,
        bio: form.get("bio") as string,
        avatar: filename,
      });
      logger.info(`用户【${id}】注册成功`);
    } catch (error) {
      if (error.message.includes("E11000 duplicate key")) {
        const error = "用户名已存在";
        flash(ctx, "error", error);
        return toBack(req);
      }
      logger.error(`用户注册失败：${error}`);
      flash(ctx, "error", error);
      return toBack(req);
    }

    return new Response(JSON.stringify({ id }));
  },
};

export default function SignupPage() {
  return <Signup />;
}
