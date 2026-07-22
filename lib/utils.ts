import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatRelativeLabel(label: string) {
    return label.charAt(0).toUpperCase() + label.slice(1);
}
