import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  user?: string | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Replace with your actual Cognito Client ID
  const COGNITO_CLIENT_ID = "436suuillsg3bce19prqjlqqt7"; //todo: put in env
  const COGNITO_ENDPOINT = "https://cognito-idp.us-east-1.amazonaws.com/";

  useEffect(() => {
    // Check if user is already logged in (check in-memory storage)
    const storedUser = sessionStorage.getItem("userInfo");
    const storedToken = sessionStorage.getItem("accessToken");

    if (storedUser && storedToken) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(COGNITO_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-amz-json-1.1",
          "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
        },
        body: JSON.stringify({
          AuthParameters: {
            USERNAME: email,
            PASSWORD: password,
          },
          AuthFlow: "USER_PASSWORD_AUTH",
          ClientId: COGNITO_CLIENT_ID,
        }),
      });

      const data = await response.json();

      if (response.ok && data.AuthenticationResult) {
        const { AccessToken, IdToken, RefreshToken } =
          data.AuthenticationResult;

        // Store tokens in session storage
        sessionStorage.setItem("accessToken", AccessToken);
        sessionStorage.setItem("idToken", IdToken);
        sessionStorage.setItem("refreshToken", RefreshToken);

        // Store user info
        const userInfo = { email };
        sessionStorage.setItem("userInfo", JSON.stringify(userInfo));

        setIsAuthenticated(true);
        setUser(userInfo);
        return { success: true };
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("idToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("userInfo");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
