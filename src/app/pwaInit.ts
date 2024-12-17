"use client";

import type { BeforeInstallPromptEvent } from "@/types/pwa";

// Initialize PWA handler
if (typeof window !== 'undefined') {
  console.log('Initializing PWA handler');
  window.deferredInstallPrompt = null;
  
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('Install prompt event captured');
    e.preventDefault();
    window.deferredInstallPrompt = e as BeforeInstallPromptEvent;
  });
}

export const triggerInstall = async () => {
  if (!window.deferredInstallPrompt) {
    console.log('No installation prompt available');
    return;
  }

  try {
    await window.deferredInstallPrompt.prompt();
    const result = await window.deferredInstallPrompt.userChoice;
    console.log('Install prompt result:', result);
    window.deferredInstallPrompt = null;
  } catch (error) {
    console.error('Error showing install prompt:', error);
  }
};

export {};
