import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router";
import Layout from "./app/Layout";
import App from "./app/App";
import Login from "./app/pages/Login";
import Register from "./app/pages/Register";
import Home from "./app/pages/Home";
import CreateTopic from "./app/pages/CreateTopic";
import TopicDetail from "./app/pages/TopicDetail";
import Notifications from "./app/pages/Notifications";
import Profile from "./app/pages/Profile";
import Manifesto from "./app/pages/Manifesto";
import "./styles/theme.css";
import "./styles/fonts.css";
import "./styles/index.css";

const router = createBrowserRouter([
  {
    Component: Layout,
    children: [
      {
        index: true,
        Component: App,
      },
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
      {
        path: "home",
        Component: Home,
      },
      {
        path: "create-topic",
        Component: CreateTopic,
      },
      {
        path: "topic/:id",
        Component: TopicDetail,
      },
      {
        path: "notifications",
        Component: Notifications,
      },
      {
        path: "profile",
        Component: Profile,
      },
      {
        path: "manifesto",
        Component: Manifesto,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);