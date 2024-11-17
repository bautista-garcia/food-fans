"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import bg from "@/public/login-bg.png";

import { signIn } from "next-auth/react";
import { useState } from "react";
import LoadingSpinner from "../LoadingSpinner";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      await signIn("google", { callbackUrl: "http://localhost:3000/map" });
    } catch (error) {
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 gap-0">
      <div className="relative hidden md:block">
        <Image
          alt="Fresh fruits and vegetables arrangement"
          className="object-cover object-left"
          fill
          src={bg}
          priority
        />
        <div className="absolute w-full h-full bg-gradient-to-r from-transparent from-50% to-gray-100 to-100%" />
      </div>
      <div className="flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">Welcome back!</h1>
                <p className="text-gray-500">
                  Enter your Credentials to access your account
                </p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="email">
                    Email address
                  </label>
                  <Input
                    id="email"
                    placeholder="Enter your email"
                    required
                    type="email"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium" htmlFor="password">
                      Password
                    </label>
                    <Link
                      className="text-sm text-blue-600 hover:underline"
                      href="#"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input id="password" required type="password" />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <label className="text-sm" htmlFor="remember">
                    Remember for 30 days
                  </label>
                </div>
                <Button
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  type="submit"
                >
                  Login
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-[5px] justify-center">
                  <Button
                    disabled={isLoading}
                    onClick={loginWithGoogle}
                    className="w-full"
                    variant="outline"
                  >
                    {isLoading ? (
                      <LoadingSpinner />
                    ) : (
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                    )}
                    Sign in with Google
                  </Button>
                  <Button className="w-full" variant="outline">
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
                    </svg>
                    Sign in with Apple
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link
                    className="text-blue-600 hover:underline"
                    href="/register"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
