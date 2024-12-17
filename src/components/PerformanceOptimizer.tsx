import { ReactNode } from "react";
import Head from "next/head";

interface PerformanceOptimizerProps {
  children: ReactNode;
}

const PerformanceOptimizer = ({ children }: PerformanceOptimizerProps) => {
  return (
    <>
      <Head>
        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="/fonts/your-main-font.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* Preconnect to critical third-party origins */}
        <link rel="preconnect" href="https://maps.googleapis.com" />
        <link rel="dns-prefetch" href="https://maps.googleapis.com" />

        {/* Meta tags for better performance */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </Head>
      {children}
    </>
  );
};

export default PerformanceOptimizer;
