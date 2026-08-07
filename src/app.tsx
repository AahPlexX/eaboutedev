import { createHashRouter, RouterProvider } from "react-router-dom";
import { AppShell } from "@/components/layout/app-shell";
import { HomePage } from "@/pages/home-page";
import { NotFoundPage } from "@/pages/not-found-page";

const router = createHashRouter([
  {
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "topics",
        lazy: async () => {
          const { TopicsPage } = await import("@/pages/topics-page");
          return { Component: TopicsPage };
        },
      },
      {
        path: "topics/:slug",
        lazy: async () => {
          const { TopicPage } = await import("@/pages/topic-page");
          return { Component: TopicPage };
        },
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
