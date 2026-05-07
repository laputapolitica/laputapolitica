"use client";

import { useEffect, useState } from "react";

interface LoadingTextProps {
  text: string;
}

interface LoadingTextGridProps {
  messages: string[];
}

export function LoadingText({ text }: LoadingTextProps) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") {
          return "";
        }

        return prev + ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="font-ui text-sm font-medium text-admin-ink">
      {text}
      <span className="inline-block w-[18px] text-left">{dots}</span>
    </span>
  );
}

export function LoadingTextGrid({ messages }: LoadingTextGridProps) {
  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="flex h-full w-full flex-col gap-2">
      {messages.map((message) => (
        <section
          key={message}
          className="flex flex-1 w-full items-center justify-center rounded-lg border-2 border-admin-ink bg-bg-base p-4 text-center"
        >
          <LoadingText text={message} />
        </section>
      ))}
    </div>
  );
}
