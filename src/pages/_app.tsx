import "@/styles/globals.css";

import { AppProps } from "next/app";
import { withTRPC } from "@trpc/next";

import { AppRouter } from "@/backend/router";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />;
};

function getBaseUrl() {
  if (typeof window !== undefined) return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    const url = `${getBaseUrl()}/api/trpc`;

    return {
      url,
    };
  },
  ssr: false,
})(MyApp);
