import "server-only";

import { createHmac, timingSafeEqual } from "crypto";

export const AUDIO_ACCESS_COOKIE = "audio_access";
export const AUDIO_ACCESS_MAX_AGE_SECONDS = 60 * 60 * 10;

const getSecret = () => {
  const secret = process.env.APP_SCRIPT_SECRET;

  if (!secret) {
    throw new Error("Missing APP_SCRIPT_SECRET");
  }

  return secret;
};

const sign = (payload: string) =>
  createHmac("sha256", getSecret()).update(payload).digest("base64url");

export const createAudioAccessToken = (orderId: string) => {
  const expiresAt = Math.floor(Date.now() / 1000) + AUDIO_ACCESS_MAX_AGE_SECONDS;
  const payload = `${orderId}.${expiresAt}`;

  return `${payload}.${sign(payload)}`;
};

export const readAudioAccessToken = (token?: string) => {
  if (!token) {
    return null;
  }

  const parts = token.split(".");

  if (parts.length !== 3) {
    return null;
  }

  const [orderId, expiresAtValue, signature] = parts;
  const expiresAt = Number(expiresAtValue);

  if (!isValidOrderId(orderId) || !Number.isFinite(expiresAt)) {
    return null;
  }

  if (expiresAt <= Math.floor(Date.now() / 1000)) {
    return null;
  }

  const payload = `${orderId}.${expiresAtValue}`;
  const expectedSignature = sign(payload);

  try {
    if (
      !timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature),
      )
    ) {
      return null;
    }
  } catch {
    return null;
  }

  return { orderId, expiresAt };
};

export const isValidOrderId = (orderId: unknown): orderId is string => {
  return typeof orderId === "string" && /^[0-9A-Za-z-]{3,64}$/.test(orderId);
};

export const PRODUCTS = [
  { key: "product1", label: "المنتج الأول" },
  { key: "product2", label: "المنتج الثاني" },
] as const;

export type ProductKey = (typeof PRODUCTS)[number]["key"];

export const isValidProductKey = (product: unknown): product is ProductKey => {
  return product === "product1" || product === "product2";
};

export const getClientIp = (request: Request) => {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || null;
  }

  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    null
  );
};
