import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="flex min-h-dvh flex-col">
      {/*
        Skip link — the first thing a keyboard user hits. Without it they must
        tab through the entire nav on every single page. Visually hidden until
        focused. None of the mockups have one.
      */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-primary focus:px-4 focus:py-3 focus:text-label-md focus:text-on-primary"
      >
        Skip to main content
      </a>

      <Header />

      <main id="main" tabIndex={-1} className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
