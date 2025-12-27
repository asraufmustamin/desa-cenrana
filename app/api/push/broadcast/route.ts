import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import webpush from "web-push";

// VAPID Keys for Push Notifications
// Set these in your environment variables (Vercel Dashboard -> Settings -> Environment Variables)
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
    "BKXlzT-ExKH5pd6cXyYwD17BZRYuj-A0BRkwWuOS-3seL0xBmjdSp6aMhBOhWRQWDWb1nVsO98hbJxG-y50juYk";
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY ||
    "GZhY7adlMxbxJEHnG_VX8b49fdph-07W23QvO762ypc";

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
