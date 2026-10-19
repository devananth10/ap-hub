import { handleFeedback } from "@/lib/feedback-http";
export const runtime = "nodejs";
export async function POST(request: Request) { return handleFeedback(request); }
