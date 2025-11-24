// utils/responsive.ts
import { Dimensions, PixelRatio } from 'react-native';

// Get device screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base design size (e.g., iPhone 14)
const BASE_WIDTH = 390;  // width of design
const BASE_HEIGHT = 844; // height of design

/**
 * Scale width based on device width
 * @param size - width in design
 */
export const scaleWidth = (size: number) => (SCREEN_WIDTH / BASE_WIDTH) * size;

/**
 * Scale height based on device height
 * @param size - height in design
 */
export const scaleHeight = (size: number) => (SCREEN_HEIGHT / BASE_HEIGHT) * size;

/**
 * Scale font size proportionally to device width
 * @param size - font size in design
 */
export const scaleFont = (size: number) => size * (SCREEN_WIDTH / BASE_WIDTH) * PixelRatio.getFontScale();

/**
 * Example usage for spacing, margins, paddings
 */
export const scaleSpacing = (size: number) => scaleWidth(size);

/**
 * Optional: For full responsive sizes in one object
 */
export const responsive = {
  w: scaleWidth,
  h: scaleHeight,
  f: scaleFont,
  s: scaleSpacing,
};

export default responsive;
