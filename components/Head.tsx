import { NavSetting } from "@/islands/NavSetting.tsx";
import Nav from "./Nav.tsx";
import type { User } from "@/modules/user/user.schema.ts";

interface Props {
  title: string;
  description: string;
  user?: User;
}

export default function Head(props: Props) {
  return (
    <>
      <Nav title={props.title} description={props.description} />
      <NavSetting user={props.user} />
    </>
  );
}
