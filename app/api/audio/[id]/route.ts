import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  AUDIO_ACCESS_COOKIE,
  AUDIO_ACCESS_MAX_AGE_SECONDS,
  isValidProductKey,
  readAudioAccessToken,
} from "@/utils/audio-access";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
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

  const { id } = await context.params;
  const { data: audioFile, error: audioError } = await supabase
    .from("audio_files")
    .select("id, storage_path")
    .eq("id", id)
    .eq("product_key", product)
    .eq("is_active", true)
    .maybeSingle();

  if (audioError) {
    return NextResponse.json(
      { success: false, error: audioError.message },
      { status: 500 },
    );
  }

  if (!audioFile) {
    return NextResponse.json({ success: false }, { status: 404 });
  }

  const { data: signedUrlData, error: signedUrlError } =
    await supabase.storage
      .from("qalamksa")
      .createSignedUrl(audioFile.storage_path, AUDIO_ACCESS_MAX_AGE_SECONDS);

  if (signedUrlError) {
    return NextResponse.json(
      { success: false, error: signedUrlError.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ url: signedUrlData.signedUrl });
}
