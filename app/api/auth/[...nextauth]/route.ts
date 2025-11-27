export const runtime = "nodejs";

import { handlers } from "@/lib/auth";

// NextAuth v5 beta: Export handlers directly
// handlers should be an object with GET and POST properties
export const { GET, POST } = handlers;
