"use client";
import Image from "next/image";

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;
const scope = "openid email profile";

const SocialLogin = ({
  account = "Google",
  disabled = false,
  className = "",
}) => {
  const handleLogin = () => {
    const params = {
      client_id: clientId ?? "",
      redirect_uri: redirectUri,
      response_type: "code",
      scope: scope,
      access_type: "offline",
      prompt: "consent",
    };

    const queryString = new URLSearchParams(params).toString();

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${queryString}`;
  };

  const Icons = {
    Google: "/google-icon.svg",
    GitHub: "/github-icon.svg",
  };

  const baseStyles =
    "w-full flex items-center justify-center px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors duration-200";

  return (
    <button
      disabled={disabled}
      className={`${baseStyles} ${
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      } ${className}`}
      onClick={handleLogin}
    >
      <Image src={Icons[account]} alt={account} width={20} height={20} />
      <span className="ml-2 text-neutral-800 dark:text-neutral-100">
        Continue with {account}
      </span>
    </button>
  );
};

export default SocialLogin;
