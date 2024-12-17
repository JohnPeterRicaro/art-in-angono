"use client";

import { useEffect } from "react";

// Define the BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Store the deferredPrompt
let deferredPrompt: BeforeInstallPromptEvent | null = null;

export const usePWANotification = () => {
  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      deferredPrompt = e as BeforeInstallPromptEvent;
      console.log("beforeinstallprompt fired");
    });
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      console.log("No installation prompt available");
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    // We've used the prompt, and can't use it again, clear it
    deferredPrompt = null;
  };

  const dismissNotification = () => {};

  return { handleInstall, dismissNotification };
};
