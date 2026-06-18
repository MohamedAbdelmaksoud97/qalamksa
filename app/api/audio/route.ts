import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  AUDIO_ACCESS_COOKIE,
  isValidProductKey,
  readAudioAccessToken,
} from "@/utils/audio-access";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET(request: Request) {
  const product = new URL(request.url).searchParams.get("product");

  if (!isValidProductKey(product)) {
    return NextResponse.json(
      { success: false, error: "Invalid product" },
      { status: 400 },
    );
  }

  const cookieStore = await cookies();
  const access = readAudioAccessToken(
    cookieStore.get(AUDIO_ACCESS_COOKIE)?.value,
  );

  if (!access) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data: order } = await supabase
    .from("orders")
    .select("order_id")
    .eq("order_id", access.orderId)
    .eq("is_active", true)
    .maybeSingle();

  if (!order) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("audio_files")
    .select("id, title, sort_order, product_key")
    .eq("product_key", product)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, files: data ?? [] });
}
