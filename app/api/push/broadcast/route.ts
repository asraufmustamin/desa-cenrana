import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import webpush from "web-push";

// Configure web-push with VAPID keys
// In production, generate your own keys with: npx web-push generate-vapid-keys
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
    "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U";
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY ||
    "UJOdWLo0xIRxK1lFmIVQwO8gTCZL2EY9Y0wSA1Gi0TU";

webpush.setVapidDetails(
    "mailto:admin@desacenrana.id",
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
);

// POST - Send push notification to all subscribers
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, message, url, tag } = body;

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        // Get all push subscriptions from database
        const { data: subscriptions, error } = await supabase
            .from("push_subscriptions")
            .select("*");

        if (error) {
            console.error("Error fetching subscriptions:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        if (!subscriptions || subscriptions.length === 0) {
            return NextResponse.json({
                success: true,
                message: "No subscribers to notify",
                sent: 0
            });
        }

        // Prepare notification payload
        const payload = JSON.stringify({
            title: title || "Pengumuman Desa Cenrana",
            body: message,
            icon: "/logo-maros.png",
            badge: "/logo-maros.png",
            url: url || "/",
            tag: tag || "pengumuman-" + Date.now()
        });

        // Send to all subscribers
        let successCount = 0;
        let failedCount = 0;
        const failedEndpoints: string[] = [];

        for (const sub of subscriptions) {
            try {
                const pushSubscription = {
                    endpoint: sub.endpoint,
                    keys: {
                        p256dh: sub.p256dh,
                        auth: sub.auth
                    }
                };

                await webpush.sendNotification(pushSubscription, payload);
                successCount++;

                // Update last_used timestamp
                await supabase
                    .from("push_subscriptions")
                    .update({ last_used: new Date().toISOString() })
                    .eq("endpoint", sub.endpoint);

            } catch (pushError: any) {
                failedCount++;
                console.error("Push failed for:", sub.endpoint, pushError.message);

                // If subscription is expired/invalid, remove it
                if (pushError.statusCode === 410 || pushError.statusCode === 404) {
                    failedEndpoints.push(sub.endpoint);
                }
            }
        }

        // Clean up expired subscriptions
        if (failedEndpoints.length > 0) {
            for (const endpoint of failedEndpoints) {
                await supabase
                    .from("push_subscriptions")
                    .delete()
                    .eq("endpoint", endpoint);
            }
        }

        return NextResponse.json({
            success: true,
            message: `Notifikasi terkirim ke ${successCount} subscriber`,
            sent: successCount,
            failed: failedCount,
            cleaned: failedEndpoints.length
        });

    } catch (error) {
        console.error("Error sending push notifications:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
