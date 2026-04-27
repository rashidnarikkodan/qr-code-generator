import { createQRInstance } from '../../../lib/qr';
import type { QRConfig } from '../types';

export const generateQR = (config: QRConfig) => {
  return createQRInstance(config);
};
