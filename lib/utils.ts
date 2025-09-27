import type { ClassValue } from "clsx"

export function cn(...inputs: ClassValue[]) {
  return inputs
    .flat()
    .filter((x) => typeof x === "string")
    .join(" ")
    .trim()
}
