// deno-lint-ignore-file no-explicit-any
import { YamlLoader } from "yaml_loader";
import { validateOrReject, ValidationError } from "deno_class_validator";

const yamlLoader = new YamlLoader();

export async function readYaml<T>(
  path: string,
): Promise<T> {
  let allPath = path;
  if (!/\.(yaml|yml)$/.test(path)) {
    allPath += ".yaml";
  }
  const data = await yamlLoader.parseFile(allPath);
  return data as T;
}

export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}

export type Constructor<T = any> = Type<T>;

export async function validateParams(Cls: Constructor, value: object) {
  if (!Cls || Cls === Object) { // if no class validation, we can skip this
    return [];
  }
  const post = new Cls();
  if (value instanceof FormData) {
    for (const [name, v] of value.entries()) {
      post[name] = v;
    }
  } else {
    Object.assign(post, value);
  }
  const msgs: string[] = [];
  try {
    await validateOrReject(post);
  } catch (errors) {
    // console.debug(errors);
    errors.forEach((err: ValidationError) => {
      if (err.constraints) {
        Object.values(err.constraints).forEach((element) => {
          msgs.push(element);
        });
      }
    });
  }
  return msgs;
}

export abstract class BaseService {
  async init(): Promise<void> {
  }
}

const services = new Map();
export async function getServiceInstance<T extends BaseService>(
  Service: Type<T>,
): Promise<T> {
  if (services.has(Service)) {
    return services.get(Service);
  }
  const instance = new Service();
  services.set(Service, instance);
  await instance.init();
  console.log(`初始化${Service.name}成功`);
  return instance;
}

/**
 * 获取重定向时的路径
 * @param url http开头的全路径
 * @param pathname 要重定向的目标路径，比如是404.html或/404.html
 */
export function getRedirectPath(url: string, pathname: string) {
  if (pathname.startsWith("http")) {
    return pathname;
  }
  return joinUrl(new URL(url).origin, pathname);
}

/**
 * 拼接url路径
 * @param prefix url前缀，比如https://uino.com，可以带/，也可以不带
 * @param pathname 要拼接的地址，比如404.html，可以带/，也可以不带
 */
export function joinUrl(prefix: string, pathname: string) {
  return prefix.replace(/\/$/, "") + "/" +
    pathname.replace(/^\//, "");
}

export function toHome(req: Request, status?: number) {
  return toPage(req, "/posts", status);
}

export function toPage(req: Request, page: `/${string}`, status?: number) {
  return Response.redirect(getRedirectPath(req.url, page), status);
}

export function toLogin(req: Request) {
  return toPage(req, "/signin");
}

export function toBack(req: Request) {
  const referer = req.headers.get("Referer");
  if (referer) {
    return Response.redirect(referer);
  } else {
    return toHome(req);
  }
}

export function isMongoId(id: unknown) {
  const mongoIdReg = /^[a-fA-F0-9]{24}$/; // 校验是否mongoId
  return typeof id === "string" && mongoIdReg.test(id);
}

export function badResponse(msg: string) {
  return new Response(msg, {
    status: 400,
  });
}