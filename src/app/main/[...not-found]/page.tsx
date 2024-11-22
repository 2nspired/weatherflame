import { notFound } from "next/navigation";

/**
 * KLUDGE: needs to throw notFound inside (main) route group
 * https://github.com/vercel/next.js/discussions/50034
 */

export default function NotFound() {
  notFound();
}
