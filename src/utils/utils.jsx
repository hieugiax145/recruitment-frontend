import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatSalary(amount) {
  if (!amount && amount !== 0) return "N/A";

  if (amount >= 1000000) {
    const millions = amount / 1000000;
    // Nếu là số nguyên triệu thì không hiển thị số lẻ
    if (millions % 1 === 0) {
      return `${millions.toFixed(0)} triệu`;
    }
    return `${millions.toFixed(1)} triệu`;
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)} nghìn`;
  } else {
    return `${amount} đ`;
  }
}

// Format ISO date/time to a readable string
// Default: vi-VN locale, e.g., 21/11/2025, 10:50
export function formatDateTime(input, options) {
  if (!input) return "";
  try {
    const date = typeof input === "string" || typeof input === "number" ? new Date(input) : input;
    if (isNaN(date.getTime())) return "";
    const fmt = new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      ...options,
    });
    return fmt.format(date);
  } catch (e) {
    return "";
  }
}
