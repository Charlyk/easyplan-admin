import pxToRemNum from "./pxToRemNum";

const pxToRem = (size) => {
  // 9.79 - is the value of 1 rem this is adjustable
  return `${pxToRemNum(size)}rem`;
};

export default pxToRem;
