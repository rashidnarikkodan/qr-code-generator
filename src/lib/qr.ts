import QRCodeStyling from 'qr-code-styling';
import type { QRConfig } from '../features/qr/types';

export const createQRInstance = (config: QRConfig) => {
  return new QRCodeStyling({
    width: config.width,
    height: config.height,
    type: config.type,
    data: config.data,
    margin: config.margin,
    qrOptions: {
      typeNumber: 0,
      mode: 'Byte',
      errorCorrectionLevel: config.errorCorrectionLevel,
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.4,
      margin: 10,
    },
    dotsOptions: {
      color: config.color,
      type: config.dotsType || 'square',
    },
    backgroundOptions: {
      color: config.backgroundColor,
    },
    cornersSquareOptions: {
      color: config.cornerSquareColor || config.color,
      type: config.cornerSquareType || 'extra-rounded',
    },
    cornersDotOptions: {
      color: config.cornerDotColor || config.color,
      type: config.cornerDotType || 'dot',
    },
    image: config.logo,
  });
};
