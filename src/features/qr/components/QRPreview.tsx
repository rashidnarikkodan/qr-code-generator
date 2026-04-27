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
  const lastTypeRef = useRef(config.type);

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

    const typeChanged = lastTypeRef.current !== config.type;

    if (!qrInstanceRef.current || typeChanged) {
      if (containerRef.current) containerRef.current.innerHTML = '';
      qrInstanceRef.current = generateQR(config);
      qrInstanceRef.current.append(containerRef.current);
      lastTypeRef.current = config.type;
    } else {
      qrInstanceRef.current.update({
        data: config.data,
        width: config.width,
        height: config.height,
        margin: config.margin,
        type: config.type,
        dotsOptions: {
          color: config.color,
          type: config.dotsType,
        },
        backgroundOptions: {
          color: config.backgroundColor,
        },
        cornersSquareOptions: {
          color: config.cornerSquareColor || config.color,
          type: config.cornerSquareType,
        },
        cornersDotOptions: {
          color: config.cornerDotColor || config.color,
          type: config.cornerDotType,
        },
        image: config.logo,
        qrOptions: {
          errorCorrectionLevel: config.errorCorrectionLevel,
        },
      });
    }
  }, [config]);

  return (
    <div className="flex justify-center items-center w-full min-h-[300px]">
      <div 
        ref={containerRef} 
        className="shadow-2xl bg-white p-4 rounded-3xl animate-float ring-1 ring-slate-100 dark:ring-slate-700" 
      />
    </div>
  );
});

QRPreview.displayName = 'QRPreview';
