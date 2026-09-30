

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

    // hash
    // store man small fields under one key
    //  -small object
    // key: keyname
    // fields :
    // name -> "Ben"
    // email -> "email"

    const hashKey = "demo:user:profile";
    await redis.hSet(hashKey, {
        name: "Ben",
        city: "USA"
    })

    const extractProfileInfo = await redis.hGetAll(hashKey);
    console.log(extractProfileInfo)

    // list
    // redis list is ordered collection of values
    const listKey = "demo:messages"
    await redis.rPush(listKey, "Hello")
    await redis.rPush(listKey, "Hi, Redis")

    const extractMessages = await redis.lRange(listKey, 0, -1)
    console.log(extractMessages);

    // set
    // sets unique sets of values only
    const setKey = "demo:tags"
    await redis.sAdd(setKey, "nodejs")
    await redis.sAdd(setKey, "nextjs")
    await redis.sAdd(setKey, "nextjs")

    const tagCount = await redis.sCard(setKey)
    console.log(tagCount)

    const rankKey = "demo:leaderboard"
    await redis.zAdd(rankKey, {score:100, value: "player 1"})
    await redis.zAdd(rankKey, {score:200, value: "player 2"})

    const newScore = await redis.zIncrBy(rankKey, 50, "player 1")

    console.log(newScore)

    const rank = await redis.zRevRank(rankKey, "player 1")
    console.log(rank)

    // ttl - Time To Live
    // key = a
    // value: 1
    // ttl = 300sec
    // got deleted after minautomatically

    const otpKey = "demo:otp"
    await redis.set(otpKey, "123456")
    await redis.expire(otpKey, 60)

    const ttl = await redis.ttl(otpKey)

    console.log(ttl)

    await redis.quit()
}


run().catch((error) => {
    console.error("demo failed:", error)
    process.exit(1)
})