import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// POST - Subscribe to push notifications
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { subscription } = body;

        if (!subscription || !subscription.endpoint || !subscription.keys) {
            return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
        }

        const { endpoint, keys } = subscription;
        const { p256dh, auth } = keys;

        // Upsert subscription (update if exists, insert if new)
        const { data, error } = await supabase
            .from("push_subscriptions")
            .upsert({
                endpoint,
                p256dh,
                auth,
                user_agent: request.headers.get("user-agent") || null,
                last_used: new Date().toISOString()
            }, {
                onConflict: "endpoint"
            })
            .select()
            .single();

        if (error) {
            console.error("Error saving subscription:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: "Berhasil berlangganan notifikasi!",
            subscription: data
        });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// DELETE - Unsubscribe from push notifications
export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json();
        const { endpoint } = body;

        if (!endpoint) {
            return NextResponse.json({ error: "Endpoint required" }, { status: 400 });
        }

        const { error } = await supabase
            .from("push_subscriptions")
            .delete()
            .eq("endpoint", endpoint);

        if (error) {
            console.error("Error deleting subscription:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: "Berhasil berhenti berlangganan"
        });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// GET - Get subscription count (admin only)
export async function GET() {
    try {
        const { count, error } = await supabase
            .from("push_subscriptions")
            .select("*", { count: "exact", head: true });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ count: count || 0 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
