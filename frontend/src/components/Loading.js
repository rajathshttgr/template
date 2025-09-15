"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";

const LoadingScreen = () => {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [imageSrc, setImageSrc] = useState(null); // start with null

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const currentTheme = theme === "system" || !theme ? systemTheme : theme;
    const isDark = currentTheme === "dark";
    setImageSrc(isDark ? "/loading-light.svg" : "/loading-dark.svg");
  }, [theme, systemTheme, mounted]);

  if (!mounted || !imageSrc) return null; // don't render until ready

  return (
    <div className="flex justify-center items-center h-screen bg-transparent">
      <div className="w-24 h-24 animate-spin">
        <Image
          src={imageSrc}
          alt="Loading..."
          width={96}
          height={96}
          priority
        />
      </div>
    </div>
  );
};

export default LoadingScreen;
