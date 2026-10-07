// Publisher / Subscriber
// Publisher sends a message
// Subscriber listens ans receives the messages
// channel is the topic name both sides use

import dotenv from "dotenv";
import { createClient } from "redis";

dotenv.config();

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

const channel = "demo:notifications";

async function run() {
    // needs two clients
    // one for publishing and one for subscribing
    const publisher = createClient({ url: redisUrl });
    const subscriber = createClient({ url: redisUrl });

    await publisher.connect();
    await subscriber.connect();
    
    console.log("publisher connected");
    console.log("subscriber connected");

    console.log("ping:", await publisher.ping());

    console.log("subscriber listens")

    // subscriber must be active before publisher sends the message
    
    await subscriber.subscribe(channel, message => {
        const data = JSON.parse(message);
        console.log("subscriber received");
        console.log("title:", data.title);
        console.log("message:", data.message);
    })

    console.log("subscribed to channel:", channel);

    console.log("publisher is sending event");

    const event = {
        title: "redis pub/sub",
        message: "this is a test message from publisher",
    }

    const receivers = await publisher.publish(channel, JSON.stringify(event));
    console.log("published event");
    console.log("ACTIVE Subscribers:", receivers);

    await new Promise((resolve) => setTimeout(resolve, 300));

    await subscriber.unsubscribe(channel);
    await subscriber.quit();
    await publisher.quit();

    console.log("publisher and subscriber disconnected");

}