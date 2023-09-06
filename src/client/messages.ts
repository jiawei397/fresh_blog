import { signal } from "@preact/signals";

export enum MessageType {
  Success = "success",
  Warning = "warning",
  Error = "error",
}

export interface IMessage {
  message: string;
  type: MessageType;
}

export const message = signal<IMessage | null>(null);

function setMessage(msg: string, type: MessageType) {
  const latest = { message: msg, type };
  message.value = latest;
  // setTimeout(() => {
  //   if (message.value === latest) {
  //     message.value = null;
  //   }
  // }, 1000);
}

export function success(msg: string) {
  setMessage(msg, MessageType.Success);
}

export function warn(msg: string) {
  setMessage(msg, MessageType.Warning);
}

export function error(msg: string) {
  setMessage(msg, MessageType.Error);
}
