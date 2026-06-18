import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  AUDIO_ACCESS_COOKIE,
  AUDIO_ACCESS_MAX_AGE_SECONDS,
  createAudioAccessToken,
  getClientIp,
  isValidOrderId,
} from "@/utils/audio-access";
import { createAdminClient } from "@/utils/supabase/admin";

type VerifyOrderPayload = {
  order_id?: unknown;
};

const logAccess = async (orderId: string | null, success: boolean, request: Request) => {
  const supabase = createAdminClient();

  await supabase.from("order_access_logs").insert({
    order_id: orderId,
    success,
    ip_address: getClientIp(request),
    user_agent: request.headers.get("user-agent"),
  });

  return supabase;
};

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as
    | VerifyOrderPayload
    | null;
  const orderId = payload?.order_id;

  if (!isValidOrderId(orderId)) {
    await logAccess(null, false, request).catch(() => null);

    return NextResponse.json({ success: false }, { status: 403 });
  }

  const supabase = createAdminClient();
  const { data: order, error } = await supabase
    .from("orders")
    .select("order_id, is_active")
    .eq("order_id", orderId)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !order) {
    await logAccess(orderId, false, request).catch(() => null);

    return NextResponse.json({ success: false }, { status: 403 });
  }

  await supabase
    .from("orders")
    .update({ last_accessed_at: new Date().toISOString() })
    .eq("order_id", orderId);

  await supabase.rpc("increment_order_used_count", {
    input_order_id: orderId,
  });

  await supabase.from("order_access_logs").insert({
    order_id: orderId,
    success: true,
    ip_address: getClientIp(request),
    user_agent: request.headers.get("user-agent"),
  });

  const cookieStore = await cookies();
  cookieStore.set(AUDIO_ACCESS_COOKIE, createAudioAccessToken(orderId), {
    httpOnly: true,
    maxAge: AUDIO_ACCESS_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return NextResponse.json({ success: true });
}
