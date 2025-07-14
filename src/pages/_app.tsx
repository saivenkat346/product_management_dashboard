import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { Toaster } from "react-hot-toast";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { Router } from "next/router";
import { useEffect } from "react";

// Configure NProgress
NProgress.configure({ showSpinner: true });

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const handleStart = () => {
      NProgress.start();

      // Add dim background
      const existing = document.getElementById("nprogress-overlay");
      if (!existing) {
        const bg = document.createElement("div");
        bg.className = "nprogress-bg"; // This class is styled in globals.css
        bg.id = "nprogress-overlay";
        document.body.appendChild(bg);
      }
    };

    const handleStop = () => {
      NProgress.done();

      // Remove dim background
      const bg = document.getElementById("nprogress-overlay");
      if (bg) document.body.removeChild(bg);
    };

    Router.events.on("routeChangeStart", handleStart);
    Router.events.on("routeChangeComplete", handleStop);
    Router.events.on("routeChangeError", handleStop);

    return () => {
      Router.events.off("routeChangeStart", handleStart);
      Router.events.off("routeChangeComplete", handleStop);
      Router.events.off("routeChangeError", handleStop);
    };
  }, []);

  return (
    <Provider store={store}>
      <Toaster position="top-center" />
      <Component {...pageProps} />
    </Provider>
  );
}
