import dotenv from "dotenv";
import { createClient } from "redis";

dotenv.config();

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

const redis = createClient({ url: redisUrl });

// cache key there
const cacheKey = "demo:products";
const cacheTtlSeconds = 60;

let dbProducts = ["Keyboard", "Mouse", "Laptop"];

async function run() {
  await redis.connect();

  //  first request - cache miss

  let cached = await redis.get(cacheKey);

  // cache aside patteren
  if (cached) {
    console.log("Cache HIT");
    console.log("data : ", JSON.parse(cached));
  } else {
    console.log("Cache MISS");
    // read from main DB
    const products = dbProducts;

    // set/save the products in redis cache
    // setx -> save ttl
    await redis.setEx(cacheKey, cacheTtlSeconds, JSON.stringify(products));
  }

  // stale cache problem
  dbProducts = ["Keyboard", "Mouse", "Laptop", "Desktop"];
  console.log(dbProducts, "dbProducts");

  cached = await redis.get(cacheKey);
  console.log("cached data ", JSON.parse(cached!));

  //   cache invalidation
  //   when DB changes, needs to delete old cache

  await redis.del(cacheKey);
  console.log("Cache Deleted");

  cached = await redis.get(cacheKey);
  if (!cached) {
    console.log("Cache data after delete");
    const freshProducts = dbProducts;
    await redis.setEx(cacheKey, cacheTtlSeconds, JSON.stringify(freshProducts));
    console.log("fresh data ", freshProducts);
  }

  await redis.quit();
}

run().catch((error) => {
  console.error("Redis caching example failed:", error);
  process.exitCode = 1;
});
