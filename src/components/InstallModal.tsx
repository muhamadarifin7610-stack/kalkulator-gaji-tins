import React, { useEffect, useState } from 'react';
import { Smartphone, Download, X, Check, Share2, MoreVertical, PlusSquare } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-emerald-400 shrink-0 shadow-sm">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Pasang di HP (Android & iPhone)</h3>
            <p className="text-xs text-slate-500">Gunakan layaknya aplikasi APK native tanpa instalasi manual</p>
          </div>
        </div>

        {installed ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center gap-2">
            <Check className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Aplikasi sudah terpasang di perangkat Anda!</span>
          </div>
        ) : (
          <div className="space-y-4">
            {deferredPrompt && (
              <button
                type="button"
                onClick={handleInstallClick}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <Download className="w-4 h-4" />
                <span>Klik untuk Pasang Otomatis</span>
              </button>
            )}

            {/* Android Instructions */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Untuk Pengguna Android (Google Chrome):</span>
              </div>
              <ol className="text-xs text-slate-600 space-y-1.5 list-decimal pl-4">
                <li>
                  Ketuk ikon <strong>titik tiga ( <MoreVertical className="w-3.5 h-3.5 inline text-slate-700" /> )</strong> di sudut kanan atas browser Chrome.
                </li>
                <li>
                  Pilih menu <strong>"Tambahkan ke Layar Utama"</strong> (Add to Home screen) atau <strong>"Install Aplikasi"</strong>.
                </li>
                <li>Ikon aplikasi akan otomatis muncul di menu HP Anda dan dapat dibuka sewaktu-waktu tanpa internet.</li>
              </ol>
            </div>

            {/* iOS Instructions */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Untuk Pengguna iPhone (Safari):</span>
              </div>
              <ol className="text-xs text-slate-600 space-y-1.5 list-decimal pl-4">
                <li>
                  Buka aplikasi di Safari, lalu ketuk tombol <strong>Share ( <Share2 className="w-3.5 h-3.5 inline text-slate-700" /> )</strong> di bilah bawah.
                </li>
                <li>
                  Gulir ke bawah dan pilih <strong>"Add to Home Screen" ( <PlusSquare className="w-3.5 h-3.5 inline text-slate-700" /> Tambah ke Layar Utama)</strong>.
                </li>
                <li>Ketuk <strong>Add</strong> di sudut kanan atas.</li>
              </ol>
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Mengerti, Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
