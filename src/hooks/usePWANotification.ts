"use client";

import { useEffect, useState } from "react";
import type { BeforeInstallPromptEvent } from "@/types/pwa";

export const usePWANotification = () => {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const checkInstallable = async () => {
      // Check if app is already installed
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      console.log('Is app in standalone mode?', isStandalone);
      
      if (isStandalone) {
        console.log('App is already installed');
        setShowInstallPrompt(false);
        return;
      }
    };

    checkInstallable();

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (event: BeforeInstallPromptEvent) => {
      console.log('Prompt available, showing install button');
      setShowInstallPrompt(true);
      window.deferredInstallPrompt = event;
    };

    // Listen for successful installation
    const handleAppInstalled = () => {
      console.log('App was installed');
      setShowInstallPrompt(false);
      window.deferredInstallPrompt = null;
    };

    // Check if we already have a deferred prompt
    if (window.deferredInstallPrompt) {
      handleBeforeInstallPrompt(window.deferredInstallPrompt);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    console.log('Install button clicked');
    
    if (!window.deferredInstallPrompt) {
      console.log("No installation prompt available");
      return;
    }

    try {
      // Show the install prompt
      await window.deferredInstallPrompt.prompt();
      const result = await window.deferredInstallPrompt.userChoice;
      console.log('User choice:', result.outcome);
      
      if (result.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      // Clear the prompt
      window.deferredInstallPrompt = null;
      setShowInstallPrompt(false);
    } catch (err) {
      console.error('Installation error:', err);
    }
  };

  const dismissNotification = () => {
    console.log('User dismissed the install notification');
    setShowInstallPrompt(false);
  };

  return { 
    showInstallPrompt,
    handleInstall, 
    dismissNotification 
  };
};
