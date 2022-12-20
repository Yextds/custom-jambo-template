import { updateEntity } from "./yext.ts";

declare var FIELD_KEY: string;

export interface WritebackPayload {
  url: string;
  entityId: string;
  locale: string;
}

export async function handleUrlWriteback(data: WritebackPayload) {
  if (data.entityId && data.locale && FIELD_KEY) {
    const result = await writebackUrl(data)
    return result
  } else {
    return null
  }
}

async function writebackUrl(data: WritebackPayload) {
  const updateField = {"meta": {"language": data.locale}}
  updateField[FIELD_KEY] = data.url
  let result = await updateEntity(data.entityId, updateField)
  return result
}
