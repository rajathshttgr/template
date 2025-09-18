"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Layout = ({ children }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (isAuthenticated === null) {
    return null;
  }

  return <div className="min-h-screen bg-black text-white">{children}</div>;
};

export default Layout;
