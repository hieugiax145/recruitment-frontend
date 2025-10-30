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
