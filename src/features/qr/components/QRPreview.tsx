import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import type { QRConfig } from '../types';
import { generateQR } from '../utils/generateQR';

interface QRPreviewProps {
  config: QRConfig;
}

export interface QRPreviewHandle {
  download: (extension: 'png' | 'svg') => void;
}

export const QRPreview = forwardRef<QRPreviewHandle, QRPreviewProps>(({ config }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrInstanceRef = useRef<ReturnType<typeof generateQR>>(null);

  useImperativeHandle(ref, () => ({
    download: (extension: 'png' | 'svg') => {
      if (qrInstanceRef.current) {
        qrInstanceRef.current.download({
          name: 'qr-code',
          extension: extension,
        });
      }
    },
  }));

  useEffect(() => {
    if (!containerRef.current) return;

    if (!qrInstanceRef.current) {
      qrInstanceRef.current = generateQR(config);
      qrInstanceRef.current.append(containerRef.current);
    } else {
      qrInstanceRef.current.update({
        data: config.data,
        width: config.width,
        height: config.height,
        margin: config.margin,
        dotsOptions: {
          color: config.color,
        },
        backgroundOptions: {
          color: config.backgroundColor,
        },
        image: config.logo,
        qrOptions: {
          errorCorrectionLevel: config.errorCorrectionLevel,
        },
      });
    }
  }, [config]);

  return (
    <div className="flex justify-center items-center bg-gray-50 rounded-xl p-8 border border-dashed border-gray-300 min-h-[350px]">
      <div ref={containerRef} className="shadow-lg bg-white p-2 rounded-lg" />
    </div>
  );
});

QRPreview.displayName = 'QRPreview';
