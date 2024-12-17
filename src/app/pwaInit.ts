// Make this a module by adding an export
export {};

// Types
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// Augment the window interface
declare global {
  interface Window {
    deferredInstallPrompt: BeforeInstallPromptEvent | null;
  }
}

// Initialize the global variable
if (typeof window !== 'undefined') {
  console.log('Initializing PWA handler');
  window.deferredInstallPrompt = null;

  // Capture the beforeinstallprompt event as early as possible
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('Global: beforeinstallprompt event captured');
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Store the event for later use
    window.deferredInstallPrompt = e as BeforeInstallPromptEvent;
  });
}
