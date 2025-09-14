"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import Button from "@/components/Button";
import useSendRequest from "@/hooks/useSendRequest";

const Console = () => {
  const [userData, setUserData] = useState(null);
  const { sendRequest, loading, error } = useSendRequest();
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await sendRequest({
          route: "user/profile",
          method: "GET",
          isAuthRoute: false,
        });
        setUserData(data);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, [sendRequest]);

  const handleLogout = async () => {
    try {
      await sendRequest({
        route: "auth/logout",
        method: "POST",
        isAuthRoute: false,
      });

      localStorage.removeItem("access_token");
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-100 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100 transition-colors">
      <div className="absolute right-4 top-4 md:right-8 md:top-8 flex items-center gap-4">
        <ThemeToggle />
        <Button text="Log Out" variant="ghost" onClick={handleLogout} />
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-neutral-200 dark:bg-neutral-800 rounded-md p-6 max-w-md w-full overflow-x-auto transition-colors">
          <pre className="text-sm font-mono whitespace-pre-wrap break-words">
            {loading
              ? "Loading..."
              : error
              ? `Error: ${error.message}`
              : userData
              ? JSON.stringify(userData, null, 2)
              : "No user data"}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default Console;
