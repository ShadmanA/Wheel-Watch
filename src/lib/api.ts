import { File, UploadType } from "expo-file-system";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

type ErrorBody = {
  detail?: string | { msg?: string }[];
  reason?: string;
};

function throwIfError(status: number, ok: boolean, body: ErrorBody) {
  if (ok) return;
  // FastAPI's own HTTPException(detail=...) is a string, but its automatic
  // request-validation errors (422) put a list of {msg, loc, ...} objects
  // in `detail` instead — stringify those properly rather than letting
  // `new Error(array)` collapse them into "[object Object]".
  const detail = body?.detail;
  const message = Array.isArray(detail)
    ? detail.map((d) => d?.msg ?? JSON.stringify(d)).join("; ")
    : (detail ?? body?.reason ?? `Request failed (${status})`);
  throw new Error(message);
}

async function parseJson(response: Response) {
  const body = await response.json();
  throwIfError(response.status, response.ok, body);
  return body;
}

export async function registerDevice(
  token: string,
  deviceId: string,
  pushToken: string,
): Promise<{ ok: boolean }> {
  const response = await fetch(`${BACKEND_URL}/register-device`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ device_id: deviceId, push_token: pushToken }),
  });
  return parseJson(response);
}

export async function enrollFace(
  token: string,
  photoUri: string,
): Promise<{ success: boolean; reason?: string }> {
  // JS-level FormData/Blob approaches both broke on this RN version
  // ("Unsupported FormDataPart implementation", then "Creating blobs from
  // 'ArrayBuffer' ... are not supported") — expo-file-system's upload()
  // does the multipart encoding natively, skipping the JS polyfill layer
  // entirely.
  const result = await new File(photoUri).upload(`${BACKEND_URL}/enroll`, {
    httpMethod: "POST",
    uploadType: UploadType.MULTIPART,
    fieldName: "face",
    mimeType: "image/jpeg",
    headers: { Authorization: `Bearer ${token}` },
  });

  const body = JSON.parse(result.body);
  throwIfError(result.status, result.status >= 200 && result.status < 300, body);
  return body;
}

export async function getTheftLocations(): Promise<{
  locations: { id: string; lat: number; lon: number; description: string }[];
}> {
  const response = await fetch(`${BACKEND_URL}/theft-locations`);
  return parseJson(response);
}

export async function getDeviceEvents(
  token: string,
  deviceId: string,
): Promise<{ events: Record<string, unknown>[] }> {
  const response = await fetch(`${BACKEND_URL}/devices/${deviceId}/events`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseJson(response);
}
