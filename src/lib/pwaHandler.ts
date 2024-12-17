export {};

// Types for PWA installation
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

declare global {
  interface Window {
    deferredInstallPrompt: BeforeInstallPromptEvent | null;
  }
}

// Initialize
if (typeof window !== 'undefined') {
  window.deferredInstallPrompt = null;
  
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('Install prompt event captured');
    e.preventDefault();
    window.deferredInstallPrompt = e as BeforeInstallPromptEvent;
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
