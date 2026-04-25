"use client";

import dynamic from "next/dynamic";

const App = dynamic(() => import("@/components/app").then((mod) => mod.App), {
  ssr: false,
});

export default function Page() {
  return <App />;
}
