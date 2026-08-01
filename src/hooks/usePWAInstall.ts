import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function usePWAInstall() {
  const [prompt,    setPrompt]    = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check if already running as installed PWA
    const isInstalled =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;

    if (isInstalled) { setInstalled(true); return; }

    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => {
      setInstalled(true);
      setPrompt(null);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const install = async () => {
    if (prompt) {
      // Native Android Chrome install
      await prompt.prompt();
      const { outcome } = await prompt.userChoice;
      if (outcome === 'accepted') { setInstalled(true); setPrompt(null); }
    } else {
      // iOS / desktop — show manual instructions modal
      setShowModal(true);
    }
  };

  return {
    canInstall: !installed,   // always show unless already installed as PWA
    install,
    showModal,
    closeModal: () => setShowModal(false),
  };
}
