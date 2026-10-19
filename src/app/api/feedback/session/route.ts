import { handleFeedback } from "@/lib/feedback-http";
export const runtime = "nodejs";
export async function GET(request: Request) { return handleFeedback(request,true); }
