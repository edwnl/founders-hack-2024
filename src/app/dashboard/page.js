"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { withGuard } from "@/components/GuardRoute";
import UserDashboard from "@/app/dashboard/UserDashboard";
import OrganizerDashboard from "@/app/dashboard/OrganizerDashboard";
import { Spin } from "antd";

function DashboardRouter() {
  const { userMode, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return userMode === "user" ? <UserDashboard /> : <OrganizerDashboard />;
}

export default withGuard(DashboardRouter, { requireAuth: true });
