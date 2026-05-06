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
import ForgotPassword from "./app/pages/ForgotPassword";
import ResetPassword from "./app/pages/ResetPassword";
import Legal from "./app/pages/Legal";
import Contact from "./app/pages/Contact";
import AdminDashboard from "./app/pages/AdminDashboard";
import "./styles/theme.css";
import "./styles/fonts.css";
import "./styles/index.css";

import { ErrorBoundary } from "./app/components/ErrorBoundary";

const router = createBrowserRouter([
  {
    Component: Layout,
    errorElement: <ErrorBoundary />,
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
        path: "forgot-password",
        Component: ForgotPassword,
      },
      {
        path: "reset-password/:token",
        Component: ResetPassword,
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
        path: "profile/:id",
        Component: Profile,
      },
      {
        path: "manifesto",
        Component: Manifesto,
      },
      {
        path: "privacy",
        element: <Legal type="privacy" />,
      },
      {
        path: "terms",
        element: <Legal type="terms" />,
      },
      {
        path: "guidelines",
        element: <Legal type="guidelines" />,
      },
      {
        path: "contact",
        Component: Contact,
      },
      {
        path: "admin",
        Component: AdminDashboard,
      },
    ],
  },
]);

import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster position="top-center" richColors />
  </StrictMode>,
);