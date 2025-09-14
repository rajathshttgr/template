"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER || "";

const useSendRequest = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/refresh`,
        {},
        { withCredentials: true }
      );
      const { access_token } = response.data;
      localStorage.setItem("access_token", access_token);
      return access_token;
    } catch (err) {
      console.error("Token refresh failed:", err);
      throw err instanceof Error
        ? err
        : new Error("Unknown error during token refresh");
    }
  }, []);

  const sendRequest = useCallback(
    async ({
      route,
      method = "GET",
      body = undefined,
      isAuthRoute = false,
      headers = {},
    }) => {
      if (!BASE_URL) {
        const err = new Error("Server base URL is not configured.");
        setError(err);
        throw err;
      }

      if (isMounted.current) {
        setLoading(true);
        setError(null);
      }

      const url = `${BASE_URL}/${route}`;
      const accessToken = localStorage.getItem("access_token");

      const config = {
        method,
        url,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        data: body,
        withCredentials: !isAuthRoute,
      };

      if (!isAuthRoute && accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      try {
        const response = await axios(config);
        if (isMounted.current) setLoading(false);
        return response.data;
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401 && !isAuthRoute) {
            try {
              const newToken = await refreshToken();
              config.headers.Authorization = `Bearer ${newToken}`;
              const retryResponse = await axios(config);
              if (isMounted.current) setLoading(false);
              return retryResponse.data;
            } catch (refreshError) {
              console.log("Refresh Error", refreshError);
              localStorage.removeItem("access_token");
              if (isMounted.current) {
                setLoading(false);
                router.push("/login");
              }
              return null;
            }
          } else {
            if (isMounted.current) {
              setError(err);
              setLoading(false);
            }
            throw err;
          }
        } else {
          const genericError =
            err instanceof Error ? err : new Error("An unknown error occurred");
          if (isMounted.current) {
            setError(genericError);
            setLoading(false);
          }
          throw genericError;
        }
      }
    },
    [refreshToken, router]
  );

  return { sendRequest, loading, error };
};

export default useSendRequest;
