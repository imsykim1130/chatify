import arcjet, { shield, detectBot, slidingWindow } from "@arcjet/node";
import { ARCJET_KEY } from "../config/env.js";

const aj = arcjet({
  key: ARCJET_KEY!,
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: ["POSTMAN", "CATEGORY:SEARCH_ENGINE"],
    }),
    // tokenBucket({
    //   mode: "LIVE",
    //   // Tracked by IP address by default, but this can be customized
    //   // See https://docs.arcjet.com/fingerprints
    //   // characteristics: ["ip.src"],
    //   refillRate: 5, // Refill 5 tokens per interval
    //   interval: 10, // Refill every 10 seconds
    //   capacity: 10, // Bucket capacity of 10 tokens
    // }),
    slidingWindow({
      // 100 requests per minute
      mode: "LIVE",
      max: 100,
      interval: 60,
    }),
  ],
});

export default aj;
