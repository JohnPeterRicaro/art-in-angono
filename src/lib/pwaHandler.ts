// Global PWA event storage
declare global {
  interface Window {
    deferredInstallPrompt: any;
  }
}

// Initialize the global variable
if (typeof window !== 'undefined') {
  window.deferredInstallPrompt = null;

  // Capture the beforeinstallprompt event as early as possible
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('Global: beforeinstallprompt event captured');
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Store the event for later use
    window.deferredInstallPrompt = e;
  });
}

export const triggerInstall = async () => {
  if (!window.deferredInstallPrompt) {
    console.log('No installation prompt available');
    return false;
  }

  try {
    // Show the prompt
    const promptEvent = window.deferredInstallPrompt;
    await promptEvent.prompt();
    
    // Wait for the user's choice
    const { outcome } = await promptEvent.userChoice;
    console.log('Installation outcome:', outcome);

    // Clear the prompt
    window.deferredInstallPrompt = null;

    return outcome === 'accepted';
  } catch (error) {
    console.error('Error installing PWA:', error);
    return false;
  }
};

export const isPWAInstalled = () => {
  if (typeof window === 'undefined') return false;
  
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as any).standalone ||
    document.referrer.includes('android-app://')
  );
};
