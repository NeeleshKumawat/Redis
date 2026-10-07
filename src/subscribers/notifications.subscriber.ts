import dotenv from "dotenv";
import { createClient } from "redis";  
import { redisClient } from "../redis/client";


const redisUrl = process.env.REDIS_URL || "redis://localhost:6379"

const notification_channel = "notifications"

export interface NotificationsPayload {
    id: string;
    title: string;
    message: string;
    createdAt: string;
}

export async function publishNotification(notifications: NotificationsPayload): Promise<void> {
    await redisClient.publish(notification_channel, JSON.stringify(notifications));
}

const subscriberClient = createClient({ url: redisUrl });

subscriberClient.on("error", (err) => console.error("Redis subscriber error:", err));



async function startNotificationSubscriber() {
    await subscriberClient.connect();
    await subscriberClient.subscribe(notification_channel, (message) => {
        try {
            const notification: NotificationsPayload = JSON.parse(message);
            console.log("new notification received");
            console.log("title:", notification.title);
            console.log("message:", notification.message);
            console.log("createdAt:", notification.createdAt);
        }
        catch {
            console.error("Failed to parse notification message:", message);
        }
        
    });
}



startNotificationSubscriber().catch((err) => {
    console.error("Failed to start notification subscriber:", err);
    process.exit(1);
});