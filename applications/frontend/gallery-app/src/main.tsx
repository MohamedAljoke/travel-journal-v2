import { StrictMode } from "react";
import { RouterProvider } from "react-router-dom";
import * as ReactDOM from "react-dom/client";
import router from "./router";
import { AuthProvider } from "./router/AuthContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
