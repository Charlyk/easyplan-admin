import hexToRGB from './hexToRGB';

export default function hexToHSV(hex): { h: number; s: number; v: number } {
  const { r, g, b } = hexToRGB(hex);
  let computedH = 0;
  let computedS = 0;
  let computedV = 0;

  //remove spaces from input RGB values, convert to int
  let red = parseInt(('' + r).replace(/\s/g, ''), 10);
  let green = parseInt(('' + g).replace(/\s/g, ''), 10);
  let blue = parseInt(('' + b).replace(/\s/g, ''), 10);

  if (
    red == null ||
    green == null ||
    blue == null ||
    isNaN(red) ||
    isNaN(green) ||
    isNaN(blue)
  ) {
    alert('Please enter numeric RGB values!');
    return;
  }
  if (
    red < 0 ||
    green < 0 ||
    blue < 0 ||
    red > 255 ||
    green > 255 ||
    blue > 255
  ) {
    alert('RGB values must be in the range 0 to 255.');
    return;
  }
  red = red / 255;
  green = green / 255;
  blue = blue / 255;
  const minRGB = Math.min(red, Math.min(green, blue));
  const maxRGB = Math.max(red, Math.max(green, blue));

  // Black-gray-white
  if (minRGB == maxRGB) {
    computedV = minRGB;
    return { h: 0, s: 0, v: computedV };
  }

  // Colors other than black-gray-white:
  const d =
    red == minRGB ? green - blue : blue == minRGB ? red - green : blue - red;
  const h = red == minRGB ? 3 : blue == minRGB ? 1 : 5;
  computedH = 60 * (h - d / (maxRGB - minRGB));
  computedS = (maxRGB - minRGB) / maxRGB;
  computedV = maxRGB;
  return { h: computedH, s: computedS, v: computedV };
}
