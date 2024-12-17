import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// Safari specific navigator interface
interface SafariNavigator extends Navigator {
  standalone?: boolean;
}

export const usePWANotification = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  // Start with showNotification as false, we'll set it to true when we have a prompt
  const [showNotification, setShowNotification] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    console.log("PWA Hook initialized");
    
    // Check if app is already installed
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    const isSafariStandalone = (window.navigator as SafariNavigator).standalone;
    const isAndroidApp = document.referrer.includes("android-app://");
    const isPWAInstalled = isStandalone || isSafariStandalone || isAndroidApp;
    
    console.log("Is PWA installed:", isPWAInstalled);
    setIsInstalled(isPWAInstalled);

    const handleBeforeInstallPrompt = (e: Event) => {
      console.log("Before install prompt event received");
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Store the event for later use
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      // Show notification when we have a prompt
      setShowNotification(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    window.addEventListener("appinstalled", () => {
      console.log("App installed event received");
      setIsInstalled(true);
      setShowNotification(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    console.log("Handle install called");
    const promptEvent = (window as any).deferredInstallPrompt;
    
    if (!promptEvent) {
      console.log("No installation prompt available");
      return;
    }

    try {
      console.log("Triggering installation prompt");
      await promptEvent.prompt();
      
      console.log("Waiting for user choice");
      const { outcome } = await promptEvent.userChoice;
      console.log("Installation outcome:", outcome);

      if (outcome === "accepted") {
        setShowNotification(false);
        (window as any).deferredInstallPrompt = null;
      } else {
        setShowNotification(false);
      }
    } catch (error) {
      console.error("Error installing PWA:", error);
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
