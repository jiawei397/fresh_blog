FROM dk.uino.cn/library/denoland-deno:alpine-1.36.2

ARG GIT_REVISION
ENV DENO_DEPLOYMENT_ID=${GIT_REVISION}

WORKDIR /app

COPY . .

RUN echo "${DENO_DEPLOYMENT_ID}"

EXPOSE 8000

# ENV DENO_DIR=deno-dir
ENV DENO_ENV=production
ENV NPM_CONFIG_REGISTRY=https://registry.npmmirror.com

RUN deno task build  && rm -rf /root/.cache/esbuild \
&& deno cache src/main.ts

RUN chown -R deno:deno /app

USER deno

CMD deno run --allow-sys --allow-read --allow-env --allow-net --allow-write --allow-run src/main.ts