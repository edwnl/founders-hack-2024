// components/GuardRoute.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export function withGuard(WrappedComponent, options = {}) {
  return function GuardedComponent(props) {
    const { user, userMode, loading } = useAuth();
    const router = useRouter();
    const [isRedirecting, setIsRedirecting] = useState(false);

    const {
      requireAuth = false,
      requireNonAuth = false,
      requiredMode = null,
    } = options;

    useEffect(() => {
      if (loading || isRedirecting) return;

      let timeoutId;

      const redirect = (path) => {
        setIsRedirecting(true);
        router.push(path);
      };

      if (requireAuth && !user) {
        redirect("/login");
      } else if (requireNonAuth && user) {
        redirect("/dashboard");
      } else if (requiredMode && user && userMode !== requiredMode) {
        timeoutId = setTimeout(() => {
          redirect(
            `/access-denied?mode=${requiredMode}&path=${window.location.pathname}`,
          );
        }, 300); // 300ms delay before redirecting to access-denied
      } else {
        setIsRedirecting(false);
      }

      return () => {
        if (timeoutId) clearTimeout(timeoutId);
      };
    }, [
      user,
      userMode,
      loading,
      router,
      requireAuth,
      requireNonAuth,
      requiredMode,
      isRedirecting,
    ]);

    if (loading) {
      return <div>Loading...</div>; // Or your custom loading component
    }

    if (isRedirecting) {
      return <div>Redirecting...</div>; // Or your custom redirecting component
    }

    if (
      (requireAuth && !user) ||
      (requireNonAuth && user) ||
      (requiredMode && user && userMode !== requiredMode)
    ) {
      return null; // Don't render anything while waiting for redirect
    }

    return <WrappedComponent {...props} />;
  };
}
