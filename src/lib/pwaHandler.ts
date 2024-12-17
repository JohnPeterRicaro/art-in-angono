"use client";

import type { BeforeInstallPromptEvent } from "@/types/pwa";

declare global {
  interface Window {
    deferredInstallPrompt: BeforeInstallPromptEvent | null;
  }
}

// Initialize PWA handler
if (typeof window !== 'undefined') {
  console.log('Initializing PWA handler');
  
  // Initialize the global variable
  window.deferredInstallPrompt = null;

  // Register service worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        console.log('Service Worker registered with scope:', registration.scope);
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    });
  }

  // Listen for beforeinstallprompt
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    console.log('Received beforeinstallprompt event');
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    window.deferredInstallPrompt = e as BeforeInstallPromptEvent;
  });

  // Listen for successful installation
  window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    window.deferredInstallPrompt = null;
  });
}

export const triggerInstall = async () => {
  const promptEvent = window.deferredInstallPrompt;
  if (!promptEvent) {
    console.log('No installation prompt available');
    return false;
  }

  try {
    await promptEvent.prompt();
    const result = await promptEvent.userChoice;
    window.deferredInstallPrompt = null;
    return result.outcome === 'accepted';
  } catch (err) {
    console.error('Installation failed:', err);
    return false;
  }
};
