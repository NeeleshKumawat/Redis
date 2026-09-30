import dotenv from 'dotenv'
import { createClient } from "redis"

dotenv.config()

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379"

const redis = createClient({url: redisUrl})

// cache key there
const cacheKey = "demo:products"
const cacheTtlSeconds = 60

const products = ['Keyboard', 'Mouse', 'Laptop']

async function run() {
    await redis.connect();

     


    await redis.quit();
}