"use client";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.jpeg";

import { useSession } from "next-auth/react";
import UserDropdown from "./UserDropDown";
import { Button } from "../ui/button";

const Navbar = () => {
  const { data: session, status } = useSession();

  return (
    <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-semibold text-gray-800">
        <Image
          src={logo}
          alt="foodReview logo"
          className="max-w-[80px] object-cover"
        />
      </Link>
      <div className="space-x-6 flex items-center">
        {/* <Link
          href="/"
          className="text-gray-600 hover:text-gray-800 sm:text-lg font-semibold"
        >
          Add Review
        </Link> */}
        <Link
          href="/"
          className="text-gray-600 hover:text-gray-800 sm:text-lg font-semibold"
        >
          Map
        </Link>
        {!session && (
          // <Link
          //   href="/login"
          //   className="px-3 py-2 rounded-md text-sm text-white bg-orange-500 hover:bg-orange-600"
          //   type="submit"
          // >
          //   Login
          // </Link>
          <></>
        )}
        {session && (
          <UserDropdown
            userImage={session.user.image}
            userName={session.user.name}
            userEmail={session.user.email}
          />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
