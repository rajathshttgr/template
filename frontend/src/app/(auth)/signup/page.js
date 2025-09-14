"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import SocialLogin from "@/components/SocialLogin";
import Button from "@/components/Button";
import useSendRequest from "@/hooks/useSendRequest";
import { useRouter } from "next/navigation";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");

  const { sendRequest, loading, error } = useSendRequest();
  const router = useRouter();

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.trim() != "") {
      return "Name can't be empty.";
    }
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }
    if (password.trim().length < 8) {
      return "Password must be at least 8 characters long.";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }
    setFormError("");

    try {
      const data = await sendRequest({
        route: "auth/register",
        method: "POST",
        body: { name, email, password },
        isAuthRoute: true,
      });
      localStorage.setItem("access_token", data.access_token);
      router.push("/console");
    } catch (err) {
      console.error("Failed to sign up:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-900 px-4 transition-colors duration-200">
      <div className="absolute right-4 top-4 md:right-8 md:top-8 flex items-center gap-4">
        <ThemeToggle />
      </div>
      <div className="max-w-md w-full space-y-8 p-8 bg-neutral-50 dark:bg-neutral-800 rounded-xl shadow-md transition-colors duration-300">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Sign Up FullStack Template
          </h2>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
            Build smarter, ship faster with FullStack Web App Template
          </p>
        </div>

        <div className="space-y-3">
          <SocialLogin account="Google" />
          <SocialLogin account="GitHub" disabled={true} />
        </div>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-neutral-300 dark:border-neutral-600" />
          <span className="mx-2 text-neutral-500 dark:text-neutral-400 text-sm">
            Or sign up with email
          </span>
          <hr className="flex-grow border-neutral-300 dark:border-neutral-600" />
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              placeholder="Name*"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-2 border rounded-md text-neutral-800 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-700 focus:outline-none focus:ring-1 transition-colors duration-200 ${
                formError.includes("name")
                  ? "border-red-500 focus:ring-red-500"
                  : "border-neutral-300 dark:border-neutral-600 focus:ring-neutral-600 dark:focus:ring-neutral-400"
              }`}
            />
          </div>

          <div>
            <input
              type="email"
              placeholder="Email*"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-2 border rounded-md text-neutral-800 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-700 focus:outline-none focus:ring-1 transition-colors duration-200 ${
                formError.includes("email")
                  ? "border-red-500 focus:ring-red-500"
                  : "border-neutral-300 dark:border-neutral-600 focus:ring-neutral-600 dark:focus:ring-neutral-400"
              }`}
            />
          </div>
          {email == "" ? (
            <></>
          ) : (
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password*"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-2 border rounded-md text-neutral-800 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-700 focus:outline-none focus:ring-1 transition-colors duration-200 pr-10 ${
                  formError.includes("Password")
                    ? "border-red-500 focus:ring-red-500"
                    : "border-neutral-300 dark:border-neutral-600 focus:ring-neutral-600 dark:focus:ring-neutral-400"
                }`}
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-neutral-500 dark:text-neutral-300"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </span>
            </div>
          )}

          {formError && <p className="text-red-500 text-sm">{formError}</p>}
          {error && (
            <p className="text-red-500 text-sm mt-2">
              {error.response?.data?.detail || "Sign up failed"}
            </p>
          )}

          <Button
            type="submit"
            variant="Primary"
            text="Sign Up"
            loading={loading}
          />
        </form>

        <div className="text-center text-sm text-neutral-600 dark:text-neutral-300">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-red-600 dark:text-red-400 hover:underline"
          >
            Log In
          </Link>
        </div>

        <p className="text-xs text-center dark:text-neutral-200 text-neutral-600">
          By signing up, I confirm that I accept the{" "}
          <span className="underline cursor-pointer">Terms and Conditions</span>{" "}
          and <span className="underline cursor-pointer">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
};

export default SignUp;
