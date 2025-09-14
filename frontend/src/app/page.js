"use client";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import Button from "@/components/Button";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-50 transition-colors duration-100">
      <div className="absolute right-4 top-4 md:right-8 md:top-8 flex items-center gap-4">
        <ThemeToggle />
        <Link href="/login">
          <Button text="Log In" variant="ghost" />
        </Link>
      </div>

      <h1 className="text-3xl sm:text-5xl text-center font-extrabold mb-4 p-4 text-neutral-50 bg-red-600">
        FULLSTACK WEB APP TEMPLATE
      </h1>
      <p className="text-xl text-center text-neutral-800 dark:text-neutral-200 transition-colors duration-100">
        Fast-track your projects with this sleek starter kit powered by Next.js
        & FastAPI. Build smarter, ship faster.
      </p>
    </div>
  );
};

export default Home;
