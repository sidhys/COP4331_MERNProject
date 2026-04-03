import { createBrowserRouter } from "react-router";
import { Root } from "./components/root.tsx";
import { Store } from "./components/store.tsx";
import { SignUp } from "./components/usignUp.tsx";
import { VerifyEmail } from "./components/verifyEmail.tsx";
import { Login } from "./components/login";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Store },
      { path: "signup", Component: SignUp },
      { path: "verify-email", Component: VerifyEmail },
      { path: "login", Component: Login },
    ],
  },
]);
