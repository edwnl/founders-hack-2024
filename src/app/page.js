// app/page.js
"use client";

import { Button } from "antd";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-40px)] bg-background px-4">
      <div className="text-center space-y-4 max-w-[600px]">
        <h1 className="text-3xl font-bold text-foreground">
          Build your component library
        </h1>
        <p className="text-sm text-muted-foreground">
          Beautifully designed components that you can copy and paste into your
          apps.
        </p>
        <div className="space-x-2">
          <Link href="/signup">
            <Button
              type="primary"
              size="middle"
              className="bg-primary text-primary-foreground border-primary hover:bg-primary/90"
            >
              Get Started
            </Button>
          </Link>
          <Link href="/events">
            <Button
              size="middle"
              className="bg-secondary text-secondary-foreground border-secondary hover:bg-secondary/90"
            >
              GitHub
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
