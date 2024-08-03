// pages/OrganizerDashboard.js
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "antd";

export default function AccessDenied() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updateUserMode } = useAuth();

  const requiredMode = searchParams.get("mode");
  const attemptedPath = searchParams.get("path");

  const handleSwitchMode = async () => {
    if (requiredMode) {
      await updateUserMode(requiredMode);
      router.push(attemptedPath || "/");
    }
  };

  return (
    <div className="flex my-auto flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
      <p className="mb-4">
        You must be in {requiredMode} to access {attemptedPath}.
      </p>
      {requiredMode && (
        <Button
          type="primary"
          onClick={handleSwitchMode}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Switch to {requiredMode} mode
        </Button>
      )}
    </div>
  );
}
