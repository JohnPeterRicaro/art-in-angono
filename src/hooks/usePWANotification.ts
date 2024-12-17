import { useEffect, useState } from "react";
import { isPWAInstalled, triggerInstall } from "@/lib/pwaHandler";

export const usePWANotification = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check initial installation status
    setIsInstalled(isPWAInstalled());

    // Show notification if there's a deferred prompt
    if (window.deferredInstallPrompt) {
      setShowNotification(true);
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = () => {
      console.log("Hook: beforeinstallprompt detected");
      setShowNotification(true);
    };

    // Listen for successful installation
    const handleAppInstalled = () => {
      console.log("App installed");
      setIsInstalled(true);
      setShowNotification(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    console.log("Attempting installation");
    const success = await triggerInstall();
    if (success) {
      setShowNotification(false);
    }
  };

  const dismissNotification = () => {
    setShowNotification(false);
  };

  return {
    showNotification,
    handleInstall,
    dismissNotification,
    isInstalled,
  };
};
