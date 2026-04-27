import { useState, useCallback } from 'react';
import type { QRConfig } from '../types';

const INITIAL_CONFIG: QRConfig = {
  data: 'https://google.com',
  width: 300,
  height: 300,
  color: '#000000',
  backgroundColor: '#ffffff',
  margin: 10,
  errorCorrectionLevel: 'M',
  type: 'svg',
  dataType: 'url',
  dotsType: 'square',
  cornerSquareType: 'extra-rounded',
  cornerDotType: 'dot',
  cornerSquareColor: '#000000',
  cornerDotColor: '#000000',
};

export const useQRCode = () => {
  const [config, setConfig] = useState<QRConfig>(INITIAL_CONFIG);

  const setData = useCallback((data: string) => {
    setConfig((prev) => ({ ...prev, data }));
  }, []);

  const updateConfig = useCallback((newConfig: Partial<QRConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  }, []);

  return {
    config,
    setData,
    updateConfig,
  };
};