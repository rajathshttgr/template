"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useSendRequest from "@/hooks/useSendRequest";
import LoadingScreen from "@/components/Loading";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const { sendRequest, loading, error } = useSendRequest();

  useEffect(() => {
    const fetchToken = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (!code) {
        router.replace("/login");
        return;
      }

      try {
        const data = await sendRequest({
          route: "auth/google",
          method: "POST",
          body: { code },
        });

        if (data?.access_token) {
          localStorage.setItem("access_token", data.access_token);
          router.replace("/console");
        } else {
          router.replace("/login");
        }
      } catch (err) {
        console.error("Google login error:", err);
        router.replace("/login");
      }
    };

    fetchToken();
  }, [router, sendRequest]);

  return (
    <div>
      {loading ? (
        <LoadingScreen />
      ) : error ? (
        "Login failed"
      ) : (
        "Logging you in..."
      )}
    </div>
  );
}
