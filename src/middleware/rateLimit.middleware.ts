
// 5 in 30 sec

import {Request, Response, NextFunction} from 'express'
import { redisClient } from '../redis/client';

const RATE_LIMIT_WINDOW_SECONDS = 60;
const RATE_LIMIT_MAX_REQUESTS = 5;

export async function productRateLimiter(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {

        // each IP will get its own counter in Redis
        // rate_limit:products:127.0..5.5
        // rate_limit:products:::1

        // lets say one user is crossing the limit - it will not goint to block everone
        // rear prod patters - behind a proxy or load balancer

        const ip = req.ip || 'unknown';
        const rateLimiterKey = `rate_limit:products:${ip}`;

        // redis is very very very good 
        const requestCount = await redisClient.incr(rateLimiterKey);

        // after 60 sec redis will delete these key and start counting from fresh
        if(requestCount === 1) {
            await redisClient.expire(rateLimiterKey, RATE_LIMIT_WINDOW_SECONDS);
        }

        res.setHeader('X-RateLimit-Limit', RATE_LIMIT_MAX_REQUESTS);
        res.setHeader('X-RateLimit-Remaining', 
            Math.max(RATE_LIMIT_MAX_REQUESTS - requestCount, 0)
        );

        if(requestCount > RATE_LIMIT_MAX_REQUESTS) {
            res.status(429).json({
                success: false,
                message: 'Too many requests. Please try again later.',
            });
            return;
        }

        next();
    }
    catch (error) {
        console.error('Rate Limit Redis Error:', error);
        next(error);
    }
}