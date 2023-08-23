import { Options } from "$fresh/plugins/twind.ts";

export default {
  selfURL: import.meta.url,
  preflight: false, // 去掉默认注入的样式
} as Options;
