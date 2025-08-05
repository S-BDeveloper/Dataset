import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "../components/features/auth/LoginForm";
import { SignupForm } from "../components/features/auth/SignupForm";
import Breadcrumb from "../components/common/Breadcrumb";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const handleSuccess = () => {
    navigate("/profile");
  };

  const handleSwitchToSignup = () => {
    setIsLogin(false);
  };

  const handleSwitchToLogin = () => {
    setIsLogin(true);
  };

  return (
    <main className="px-4 py-8">
      <Breadcrumb />
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {isLogin ? "Welcome Back" : "Join Us"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isLogin
              ? "Sign in to access your account and favorites"
              : "Create an account to save favorites and track your activity"}
          </p>
        </div>

        {isLogin ? (
          <LoginForm
            onSuccess={handleSuccess}
            onSwitchToSignup={handleSwitchToSignup}
          />
        ) : (
          <SignupForm
            onSuccess={handleSuccess}
            onSwitchToLogin={handleSwitchToLogin}
          />
        )}
      </div>
    </main>
  );
};

export default Login;
