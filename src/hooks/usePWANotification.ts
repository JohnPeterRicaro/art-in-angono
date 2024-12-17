import { useEffect, useState } from "react";
import { triggerInstall } from "@/lib/pwaHandler";

export const usePWANotification = () => {
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = () => {
      console.log("Install prompt available");
      setShowNotification(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  const handleInstall = async () => {
    console.log("Attempting installation");
    const success = await triggerInstall();
    if (success) {
      setShowNotification(false);
    }
  };

  const dismissNotification = () => setShowNotification(false);

  return {
    showNotification,
    handleInstall,
    dismissNotification,
  };
};
