export const SOURCE_MODE = (
  process.env.NEXT_PUBLIC_SOURCE_MODE ??
  process.env.SOURCE_MODE ??
  "live"
).toLowerCase() as "live" | "mirror";

export const isLive = SOURCE_MODE === "live";
export const isMirror = SOURCE_MODE === "mirror";
