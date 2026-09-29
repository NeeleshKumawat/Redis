

// string
// hash
// list
// set
// sorted set
// ttl


// string
// store one value under one key
// ex - plain text, numbers stored as Text, counters
// key: page_views
// value: "100"

import dotenv from 'dotenv'
import { createClient } from "redis"

dotenv.config()

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379"

const redis = createClient({url: redisUrl})

async function run() {
    // open connection to redis server

    await redis.connect()
    console.log("connected to redis")
    console.log("ping", await redis.ping())

    // string
    const stringKey = "demo:page_views"
    await redis.set(stringKey,"100")

    const pageViews = await redis.get(stringKey)
    console.log(pageViews)

    // redis strings can also work like counters

    const afterIncr = await redis.incr(stringKey)
    console.log(afterIncr)
}

run().catch((error) => {
    console.error("demo failed:", error)
    process.exit(1)
})