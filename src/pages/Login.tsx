
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import config from '@/config';

console.log(import.meta.env.VITE_API_URL)

export const Login = () => {
  const { loginWithPopup, isLoading, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);


  const handleLogin = async () => {
    try {
      await loginWithPopup();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleSignUp = async () => {
    try {
      await loginWithPopup({
        authorizationParams: {
          screen_hint: "signup",
        },
      });
    } catch (error) {
      console.error("Sign up failed:", error);
    }
  };

  const handleForgotPassword = async () => {
    try {
      await loginWithPopup({
        authorizationParams: {
          screen_hint: "reset_password",
        },
      });
    } catch (error) {
      console.error("Password reset failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            className="w-full"
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Log In"}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleSignUp}
            disabled={isLoading}
          >
            Sign Up
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            variant="link"
            onClick={handleForgotPassword}
            disabled={isLoading}
          >
            Forgot Password?
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

//export default Login;