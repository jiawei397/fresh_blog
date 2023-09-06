import Head from "@/components/Head.tsx";
import { defineApp } from "$fresh/server.ts";
import Notification from "@/components/Notification.tsx";
import globals from "@/globals.ts";
import { State } from "@/modules/session/session.middleware.ts";
import Modal from "@/islands/Modal.tsx";

// deno-lint-ignore require-await
export default defineApp<State>(async (_req, ctx) => {
  const title = globals.meta.title;
  const description = globals.meta.description;
  const session = ctx.state.session;
  const { user, success, error } = session || {};
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>fresh_blog</title>
        <link rel="stylesheet" href="https://cdn.uino.cn/deno/semantic.css" />
        <link rel="stylesheet" href="/styles.css" />
        <script src="https://cdn.bootcss.com/jquery/1.11.3/jquery.min.js" defer>
        </script>
        <script
          src="https://cdn.bootcss.com/semantic-ui/2.1.8/semantic.min.js"
          defer
        >
        </script>
        <script src="/footer.js" defer></script>
      </head>
      <body>
        <Head title={title} description={description} user={user} />
        <Notification success={success} error={error} />
        <Modal />
        <ctx.Component />
      </body>
    </html>
  );
});
