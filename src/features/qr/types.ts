export type QRConfig = {
  data: string;
  width: number;
  height: number;
  color: string;
  backgroundColor: string;
  margin: number;
  logo?: string;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  type?: 'svg' | 'canvas';
  dataType?: 'text' | 'url' | 'wifi' | 'vcard' | 'email' | 'social';
  dotsType?: 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded';
  cornerSquareType?: 'dot' | 'square' | 'extra-rounded' | 'rounded' | 'classy' | 'classy-rounded';
  cornerDotType?: 'dot' | 'square';
  cornerSquareColor?: string;
  cornerDotColor?: string;
};