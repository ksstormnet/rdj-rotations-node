// src/models/rotationCodes.ts
export const ROTATION_CATEGORIES = [
  // Core Categories
  'CE', // Core Early (1978-1983)
  'CM', // Core Mid (1984-1988)
  'CL', // Core Late (1989-1993)
  'M', // Modern (Post-1994)
  'G', // Gold (Pre-1978)

  // Format Categories
  'I', // Image
  'SCh', // Christian
  'SCo', // Country
  'SD', // Disco/Bubblegum
  'SP', // Pop
  'SR', // Rock
  'PB', // Power Ballad

  // Alternative Notations
  'D', // Disco (alternative for SD)
  'Co', // Country (alternative for SCo)

  // Non-Music Elements
  'TOH', // Top of Hour
  'ID', // Station ID
  'B', // Between Jingle
  'tM', // to Music Jingle
] as const;

export type CategoryCode = (typeof ROTATION_CATEGORIES)[number];

export const ROTATION_RULES = {
  DATE_BASED: ['CE', 'CM', 'CL', 'M', 'G'] as CategoryCode[],
  SOUND_BASED: ['SCo', 'SCh', 'SP', 'SR', 'SD', 'PB'] as CategoryCode[],
  UTILITY: ['I', 'TOH', 'ID', 'B', 'tM'] as CategoryCode[],
  VALID_OPENERS: ['CE', 'CM', 'CL', 'M'] as CategoryCode[],
  THIRD_SET_POSITION5: ['SP', 'SR', 'SD', 'SCo'] as CategoryCode[],
  JINGLE_TYPES: ['B', 'tM'] as CategoryCode[],
} as const;

export function isDateBased(category: CategoryCode): boolean {
  return ROTATION_RULES.DATE_BASED.includes(category);
}

export function isSoundBased(category: CategoryCode): boolean {
  return ROTATION_RULES.SOUND_BASED.includes(category);
}

export function isJingle(category: CategoryCode): boolean {
  return ROTATION_RULES.JINGLE_TYPES.includes(category);
}

export function isValidRotationCategory(
  category: string
): category is CategoryCode {
  return ROTATION_CATEGORIES.includes(category as CategoryCode);
}

export function normalizeCategory(category: CategoryCode): CategoryCode {
  switch (category) {
    case 'D':
      return 'SD';
    case 'Co':
      return 'SCo';
    default:
      return category;
  }
}
