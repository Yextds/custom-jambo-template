import { updateEntity } from "./yext.ts";

var FIELD_KEY = "geomodifier";

export interface WritebackPayload {
  url: string;
  entityId: string;
  locale: string;
  address: any;
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
  updateField[FIELD_KEY] = data.url;
  console.log('updateEntity data', data);
  let result = await updateEntity(data.entityId, updateField);
  return result
}
