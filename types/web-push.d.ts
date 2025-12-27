declare module 'web-push' {
    interface VapidDetails {
        subject: string;
        publicKey: string;
        privateKey: string;
    }

    interface PushSubscription {
        endpoint: string;
        keys: {
            p256dh: string;
            auth: string;
        };
    }

    interface RequestOptions {
        headers?: Record<string, string>;
        TTL?: number;
    }

    interface WebPushError extends Error {
        statusCode: number;
        body: string;
    }

    export function setVapidDetails(
        subject: string,
        publicKey: string,
        privateKey: string
    ): void;

    export function sendNotification(
        subscription: PushSubscription,
        payload: string | Buffer,
        options?: RequestOptions
    ): Promise<{ statusCode: number; body: string; headers: Record<string, string> }>;

    export function generateVAPIDKeys(): { publicKey: string; privateKey: string };
}
