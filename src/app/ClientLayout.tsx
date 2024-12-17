"use client";

import { useEffect } from "react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const registerServiceWorker = async () => {
      try {
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.register('/service-worker.js', {
            scope: '/'
          });
          console.log('Service Worker registration successful with scope:', registration.scope);
        }
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    };

    // Register service worker first
    registerServiceWorker();

    // Handle beforeinstallprompt event at the root level
    const handleInstallPrompt = (e: Event) => {
      console.log('Root: beforeinstallprompt event captured');
      // Don't prevent default here to allow the native prompt
      // Store the event in window for access by other components
      (window as any).deferredInstallPrompt = e;
    };

    window.addEventListener('beforeinstallprompt', handleInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
    };
  }, []);

  // Defer non-critical scripts
  const loadNonCriticalScripts = () => {
    // Add any non-critical script loading here
  };

  if (typeof window !== 'undefined') {
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(loadNonCriticalScripts);
    } else {
      setTimeout(loadNonCriticalScripts, 1000);
    }
  }

  return <>{children}</>;
}
