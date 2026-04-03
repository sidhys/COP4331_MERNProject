import { createBrowserRouter } from "react-router";
import { Root } from "./components/ui/root.tsx";
import { Store } from "./components/ui/store.tsx";
import { SignUp } from "./components/ui/signUp.tsx";
import { VerifyEmail } from "./components/ui/verifyEmail.tsx";
import { Login } from "./components/ui/login";

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
