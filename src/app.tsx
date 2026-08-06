import { createHashRouter, RouterProvider } from "react-router-dom";
import { AppShell } from "@/components/layout/app-shell";
import { HomePage } from "@/pages/home-page";
import { NotFoundPage } from "@/pages/not-found-page";
import { TopicPage } from "@/pages/topic-page";
import { TopicsPage } from "@/pages/topics-page";

const router = createHashRouter([
  {
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "topics", element: <TopicsPage /> },
      { path: "topics/:slug", element: <TopicPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
