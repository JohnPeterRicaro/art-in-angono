"use client";

import { usePWANotification } from "@/hooks/usePWANotification";
import { X } from "lucide-react";

const PWANotification = () => {
  const { showInstallPrompt, handleInstall, dismissNotification } =
    usePWANotification();

  if (!showInstallPrompt) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />

      {/* Modal */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 z-50 animate-fade-in">
        <div className="flex flex-col items-center text-center">
          <img
            src="/art-in-angono-logo.png"
            alt="Art in Angono Logo"
            className="w-24 h-24 mb-4 rounded-lg shadow-md"
          />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Install Art in Angono
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
            Get quick access to Art in Angono right from your home screen!
          </p>
          <div className="flex gap-3 w-full">
            <button
              onClick={handleInstall}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Install Now
            </button>
            <button
              onClick={dismissNotification}
              className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
        <button
          onClick={dismissNotification}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          aria-label="Close notification"
        >
          <X size={20} />
        </button>
      </div>
    </>
  );
};

export default PWANotification;
