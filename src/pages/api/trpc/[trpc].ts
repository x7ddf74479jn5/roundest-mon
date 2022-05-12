import { inferProcedureOutput } from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";

import { appRouter } from "@/backend/router";
import type { AppRouter } from "@/backend/router";

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});

export type InferQueryResponse<TRouteKey extends keyof AppRouter["_def"]["queries"]> = inferProcedureOutput<
  AppRouter["_def"]["queries"][TRouteKey]
>;
