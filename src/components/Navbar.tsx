"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { LogIn } from "lucide-react";

const Navbar = () => {
  const { data: session } = useSession();
  const user = session?.user;

  const capitalizedUsername =
    user?.username.charAt(0).toUpperCase() + user?.username.slice(1);

  return (
    <nav className="w-full bg-black text-white shadow-md fixed top-0 z-50 backdrop-blur-md ">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo/Brand */}
        <Link href="/">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Mystery Message Logo"
              width={32}
              height={32}
              className="rounded"
            />
            <span className="text-xl font-bold text-white">
              Mystery Message
            </span>
          </div>
        </Link>

        {/* Auth Section */}
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <span className="text-sm font-medium text-white/80">
                {/* Welcome, {user?.username || user?.email} */}
                <span className="text-sm text-gray-300">
                  Hi, {capitalizedUsername || user?.email}
                </span>
              </span>
              <Button
                variant="outline"
                className="border-white text-black hover:bg-white hover:text-black transition"
                onClick={() => signOut()}
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button className="bg-white text-black hover:bg-gray-200 transition cursor-pointer flex items-center gap-2">
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
