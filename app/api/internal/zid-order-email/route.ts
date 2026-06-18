import { NextResponse } from "next/server";
import { isValidOrderId } from "@/utils/audio-access";
import { createAdminClient } from "@/utils/supabase/admin";

type ZidOrderEmailPayload = {
  secret?: unknown;
  order_id?: unknown;
  gmail_message_id?: unknown;
  email_subject?: unknown;
  from?: unknown;
};

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as
    | ZidOrderEmailPayload
    | null;

  const requestSecret =
    request.headers.get("x-app-script-secret") || payload?.secret;

  if (!payload || requestSecret !== process.env.APP_SCRIPT_SECRET) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  if (!isValidOrderId(payload.order_id)) {
    return NextResponse.json(
      { success: false, error: "Invalid order_id" },
      { status: 400 },
    );
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .upsert(
      {
        order_id: payload.order_id,
        gmail_message_id:
          typeof payload.gmail_message_id === "string"
            ? payload.gmail_message_id
            : null,
        email_subject:
          typeof payload.email_subject === "string"
            ? payload.email_subject
            : null,
        from_email: typeof payload.from === "string" ? payload.from : null,
        is_active: true,
        processed_at: new Date().toISOString(),
      },
      { onConflict: "order_id" },
    )
    .select("order_id")
    .single();

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, order_id: data.order_id });
}
