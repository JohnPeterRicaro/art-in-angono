// Types
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

declare global {
  interface Window {
    deferredInstallPrompt: BeforeInstallPromptEvent | null;
  }
}

// Check if PWA is already installed
export const isPWAInstalled = () => {
  if (typeof window === 'undefined') return false;
  
  // Check if the app is running in standalone mode (installed as PWA)
  return window.matchMedia('(display-mode: standalone)').matches;
};

// Trigger the installation prompt
export const triggerInstall = async (): Promise<boolean> => {
  console.log("Triggering install...");
  
  if (!window.deferredInstallPrompt) {
    console.log("No deferred prompt available");
    return false;
  }

  try {
    // Show the prompt
    await window.deferredInstallPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const choiceResult = await window.deferredInstallPrompt.userChoice;
    
    // Clear the prompt
    window.deferredInstallPrompt = null;
    
    return choiceResult.outcome === 'accepted';
  } catch (err) {
    console.error('Error during installation:', err);
    return false;
  }
};
