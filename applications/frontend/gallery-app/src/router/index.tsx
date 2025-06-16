import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import GalleryPage from "../pages/home";
import { LoginPage } from "../pages/login";
import { ROUTES } from "./routes";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <p>Não encontrado</p>,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
      { path: ROUTES.LOGIN, element: <LoginPage /> },
      {
        path: ROUTES.GALLERY,
        element: (
          <ProtectedRoute>
            <GalleryPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
