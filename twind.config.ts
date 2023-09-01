import { defineConfig, type Preset } from "twind";
import type { Options } from "$fresh/plugins/twindv1.ts";
// twind preset
import presetTailwind from "@twind/preset-tailwind";
import presetAutoprefix from "@twind/preset-autoprefix";

const config = defineConfig({
  presets: [
    presetTailwind() as Preset,
    presetAutoprefix(),
  ],
  preflight: false, // 去掉默认注入的样式
});

export default {
  ...config,
  selfURL: import.meta.url,
} as Options;
