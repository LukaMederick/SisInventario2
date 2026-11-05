import React, { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera } from 'lucide-react';
import { Modal } from './Modal';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (decodedText: string) => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  isOpen, onClose, onScanSuccess,
}) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const elementId = 'reader-container';

  const stopScanner = () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          scannerRef.current.stop().then(() => {
            scannerRef.current?.clear();
            scannerRef.current = null;
          });
        } else {
          scannerRef.current.clear();
          scannerRef.current = null;
        }
      } catch (err) { console.error(err); }
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (isOpen) {
      const timer = setTimeout(() => {
        if (!isMounted) return;
        const html5QrCode = new Html5Qrcode(elementId);
        scannerRef.current = html5QrCode;
        html5QrCode.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => { onScanSuccess(decodedText); stopScanner(); onClose(); },
          () => {}
        ).catch((err) => console.error('Camera error:', err));
      }, 300);
      return () => { clearTimeout(timer); isMounted = false; stopScanner(); };
    }
    stopScanner();
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => { stopScanner(); onClose(); }}
      title="Escanear Código QR de Activo"
      subtitle="Apunta la cámara al código QR de la etiqueta del equipo"
      maxWidth="md"
    >
      <div className="flex flex-col items-center">
        <div id={elementId} className="w-full max-w-[320px] aspect-square rounded-2xl overflow-hidden border-2 border-dashed border-emerald-500 bg-slate-900 flex items-center justify-center text-white">
          <Camera className="w-8 h-8 text-slate-500 animate-pulse" />
        </div>
        <p className="mt-4 text-xs text-slate-500 text-center">
          Al detectar el código QR, la búsqueda o selección se realizará automáticamente.
        </p>
      </div>
    </Modal>
  );
};
