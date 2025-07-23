import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateForInput(date: string | number | undefined): string {
  if (!date) return "";
  if (typeof date === "number") {
    // Convert timestamp to YYYY-MM-DD
    return new Date(date).toISOString().slice(0, 10);
  }
  // If already in YYYY-MM-DD format, return as is
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  // If string timestamp
  if (!isNaN(Number(date))) {
    return new Date(Number(date)).toISOString().slice(0, 10);
  }
  return date;
}
