import "styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "components/Layout/Layout";

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
