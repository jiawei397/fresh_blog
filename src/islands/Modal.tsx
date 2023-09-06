import { message } from "@/client/messages.ts";

const Modal = () => {
  const msg = message.value?.message;
  if (!msg) return <></>;
  const cls = `ui ${message.value!.type} message`;
  return (
    <div class="ui grid">
      <div class="four wide column"></div>
      <div class="eight wide column">
        <div class={cls}>
          <p>{msg}</p>
        </div>
      </div>
    </div>
  );
};

export default Modal;
