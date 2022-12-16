import { handleUrlWriteback, WritebackPayload } from "./app.ts";

export function onUrlChange(arg: WritebackPayload) {
  return handleUrlWriteback(arg);
}