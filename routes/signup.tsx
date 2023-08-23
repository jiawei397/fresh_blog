import Signup from "@/components/SignupForm.tsx";
import { Handlers } from "$fresh/server.ts";
import {
  getServiceInstance,
  toBack,
  toHome,
  validateParams,
} from "@/modules/tools/utils.ts";
import { CreateUserDto } from "@/modules/user/user.dto.ts";
import { logger } from "@/modules/tools/log.ts";
import { UserService } from "@/modules/user/user.service.ts";
import { Gender } from "@/modules/user/user.schema.ts";
import { nanoid } from "nanoid";
import { flash } from "@/modules/session/session.middleware.ts";

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
      const error = "两次输入密码不一致";
      flash(ctx, "error", error);
      return toBack(req);
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
    const userService = await getServiceInstance(UserService);
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
      let msg = error.message;
      if (error.message.includes("E11000 duplicate key")) {
        logger.warn(`用户名已存在: ${form.get("name")}`);
        msg = "用户名已存在";
      } else {
        logger.error(`用户注册失败：${error}`);
      }
      flash(ctx, "error", msg);
      return toBack(req);
    }

    flash(ctx, "success", "注册成功");
    flash(ctx, "userId", id);
    return toHome(req);
  },
};

export default function SignupPage() {
  return <Signup />;
}
