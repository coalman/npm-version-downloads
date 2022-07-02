import "styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "components/Layout/Layout";

if (process.env.NEXT_PUBLIC_API_MOCKING === "enabled") {
  require("../lib/mocks/api");
}

function MyApp({ Component, pageProps }: AppProps) {
  let content = <Component {...pageProps} />;

  if ((Component as any).getLayout) {
    content = (Component as any).getLayout(content);
  } else {
    content = <Layout>{content}</Layout>;
  }

  return content;
}

export default MyApp;
