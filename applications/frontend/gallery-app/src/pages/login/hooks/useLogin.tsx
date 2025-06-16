import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../router/AuthContext";
import { ROUTES } from "../../../router/routes";

export default function useLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await login(email, password);
    if (result.success) {
      navigate(ROUTES.GALLERY);
    }
    if (!result.success) {
      setError(result.error);
    }
    setIsLoading(false);
  };
  return {
    email,
    password,
    handleSubmit,
    isLoading,
    error,
    setEmail,
    setPassword,
  };
}
