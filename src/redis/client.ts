import {createClient} from 'redis'

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379"

export const redisClient = createClient({url:redisUrl})

redisClient.on("connect", () => {
    console.log("Redis Client Connected")
})

redisClient.on("ready", () => {
    console.log("Redis Client Ready")
})

redisClient.on("error", (error) => {
    console.log("Redis Client Error --> ", error)
})
redisClient.on("end", () => {
    console.log("Redis Client Connection Closed")
})

export async function connectRedis(): Promise<void>{
    if(!redisClient.isOpen){
        await redisClient.connect()
    }

    const pong = await redisClient.ping();
    console.log("Redis Ping Response -> ", pong)
}

export async function disconnectRedis(): Promise<void>{
    if(redisClient.isOpen){
        await redisClient.quit()
    }
}