"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import logo from "@/public/logo.jpeg";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoginWithGoogle from "./login/LoginWithGoogle";

export default function FloatCard({
  children,
  title = "Floating Card",
  initialPosition = { x: 100, y: 100 },
  initialSize = { width: 400, height: 600 },
  minSize = { width: 300, height: 200 },
  maxSize = { width: 800, height: 1000 },
}) {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null);
  const cardRef = useRef(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition]);

  const handleAdd = () => {
    if (status === "authenticated") {
      router.push("/addRestaurant");
    } else {
      router.push("/login");
    }
  };

  const handleMouseDown = (e, action, handle = null) => {
    e.preventDefault();
    if (action === "drag") {
      setIsDragging(true);
      dragStart.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
    } else if (action === "resize") {
      setIsResizing(true);
      setResizeHandle(handle);
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        width: size.width,
        height: size.height,
        left: position.x,
        top: position.y,
      };
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.current.x;
      const newY = e.clientY - dragStart.current.y;
      const maxX = window.innerWidth - size.width;
      const maxY = window.innerHeight - size.height;

      setPosition({
        x: Math.min(Math.max(0, newX), maxX),
        y: Math.min(Math.max(0, newY), maxY),
      });
    } else if (isResizing) {
      const deltaX = e.clientX - dragStart.current.x;
      const deltaY = e.clientY - dragStart.current.y;
      let newWidth = size.width;
      let newHeight = size.height;
      let newX = position.x;
      let newY = position.y;

      switch (resizeHandle) {
        case "e":
          newWidth = Math.min(
            Math.max(minSize.width, dragStart.current.width + deltaX),
            maxSize.width
          );
          break;
        case "w":
          const widthDiff = Math.min(
            Math.max(minSize.width - dragStart.current.width, deltaX),
            maxSize.width - dragStart.current.width
          );
          newWidth = dragStart.current.width - widthDiff;
          newX = dragStart.current.left + widthDiff;
          break;
        case "s":
          newHeight = Math.min(
            Math.max(minSize.height, dragStart.current.height + deltaY),
            maxSize.height
          );
          break;
        case "n":
          const heightDiff = Math.min(
            Math.max(minSize.height - dragStart.current.height, deltaY),
            maxSize.height - dragStart.current.height
          );
          newHeight = dragStart.current.height - heightDiff;
          newY = dragStart.current.top + heightDiff;
          break;
        case "se":
          newWidth = Math.min(
            Math.max(minSize.width, dragStart.current.width + deltaX),
            maxSize.width
          );
          newHeight = Math.min(
            Math.max(minSize.height, dragStart.current.height + deltaY),
            maxSize.height
          );
          break;
        case "sw":
          newHeight = Math.min(
            Math.max(minSize.height, dragStart.current.height + deltaY),
            maxSize.height
          );
          const swWidthDiff = Math.min(
            Math.max(minSize.width - dragStart.current.width, deltaX),
            maxSize.width - dragStart.current.width
          );
          newWidth = dragStart.current.width - swWidthDiff;
          newX = dragStart.current.left + swWidthDiff;
          break;
        case "ne":
          newWidth = Math.min(
            Math.max(minSize.width, dragStart.current.width + deltaX),
            maxSize.width
          );
          const neHeightDiff = Math.min(
            Math.max(minSize.height - dragStart.current.height, deltaY),
            maxSize.height - dragStart.current.height
          );
          newHeight = dragStart.current.height - neHeightDiff;
          newY = dragStart.current.top + neHeightDiff;
          break;
        case "nw":
          const nwWidthDiff = Math.min(
            Math.max(minSize.width - dragStart.current.width, deltaX),
            maxSize.width - dragStart.current.width
          );
          const nwHeightDiff = Math.min(
            Math.max(minSize.height - dragStart.current.height, deltaY),
            maxSize.height - dragStart.current.height
          );
          newWidth = dragStart.current.width - nwWidthDiff;
          newHeight = dragStart.current.height - nwHeightDiff;
          newX = dragStart.current.left + nwWidthDiff;
          newY = dragStart.current.top + nwHeightDiff;
          break;
      }

      setSize({ width: newWidth, height: newHeight });
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing]);

  return (
    <Card
      ref={cardRef}
      className="fixed backdrop-blur-md bg-white/90 shadow-lg border-none overflow-hidden"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        zIndex: 10,
      }}
    >
      <CardHeader
        className="cursor-move p-4 bg-gray-50/50"
        onMouseDown={(e) => handleMouseDown(e, "drag")}
      >
        {/* <CardTitle className="text-lg font-semibold text-gray-800">
          {title}
        </CardTitle> */}
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="text-xl font-semibold text-gray-800">
            <Image
              src={logo}
              alt="foodrestaurant logo"
              className="max-w-[80px] object-cover"
            />
          </Link>
          <LoginWithGoogle />
        </div>
        <div>
          <Button
            onClick={handleAdd}
            className="bg-gray-900 text-white hover:bg-gray-800"
          >
            + Add Restaurant
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4 overflow-auto h-[calc(100%-4rem)] custom-scrollbar">
        {children}
      </CardContent>

      {/* Resize handles */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Corners */}
        <div
          className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize pointer-events-auto"
          onMouseDown={(e) => handleMouseDown(e, "resize", "nw")}
        />
        <div
          className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize pointer-events-auto"
          onMouseDown={(e) => handleMouseDown(e, "resize", "ne")}
        />
        <div
          className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize pointer-events-auto"
          onMouseDown={(e) => handleMouseDown(e, "resize", "sw")}
        />
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize pointer-events-auto"
          onMouseDown={(e) => handleMouseDown(e, "resize", "se")}
        />

        {/* Edges */}
        <div
          className="absolute top-0 left-4 right-4 h-2 cursor-n-resize pointer-events-auto"
          onMouseDown={(e) => handleMouseDown(e, "resize", "n")}
        />
        <div
          className="absolute bottom-0 left-4 right-4 h-2 cursor-s-resize pointer-events-auto"
          onMouseDown={(e) => handleMouseDown(e, "resize", "s")}
        />
        <div
          className="absolute left-0 top-4 bottom-4 w-2 cursor-w-resize pointer-events-auto"
          onMouseDown={(e) => handleMouseDown(e, "resize", "w")}
        />
        <div
          className="absolute right-0 top-4 bottom-4 w-2 cursor-e-resize pointer-events-auto"
          onMouseDown={(e) => handleMouseDown(e, "resize", "e")}
        />
      </div>
    </Card>
  );
}
