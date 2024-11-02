export enum MusicSetPattern {
  I = 'PATTERN_I',
  II = 'PATTERN_II',
  III = 'PATTERN_III',
}

export type SlotType = 'Image' | 'Music' | 'Jingle';

export interface PatternSlot {
  type: SlotType;
  code: string;
}

export class Pattern {
  private sequence: PatternSlot[];
  private patternType: MusicSetPattern;

  // Categories that are considered date-based
  private static readonly DATE_BASED_CATEGORIES = ['CE', 'CM', 'CL', 'M', 'G'];

  constructor(type: MusicSetPattern) {
    this.patternType = type;
    this.sequence = this.initializeSequence(type);
  }

  private initializeSequence(type: MusicSetPattern): PatternSlot[] {
    switch (type) {
      case MusicSetPattern.I:
        return [
          { type: 'Image', code: 'I' },
          { type: 'Music', code: 'M' },
          { type: 'Jingle', code: 'J' },
          { type: 'Music', code: 'M' },
          { type: 'Music', code: 'M' },
          { type: 'Jingle', code: 'J' },
          { type: 'Music', code: 'M' },
        ];
      case MusicSetPattern.II:
        return [
          { type: 'Image', code: 'I' },
          { type: 'Music', code: 'M' },
          { type: 'Jingle', code: 'J' },
          { type: 'Music', code: 'M' },
          { type: 'Music', code: 'M' },
          { type: 'Music', code: 'M' },
          { type: 'Music', code: 'M' },
        ];
      case MusicSetPattern.III:
        return [
          { type: 'Image', code: 'I' },
          { type: 'Music', code: 'M' },
          { type: 'Music', code: 'M' },
          { type: 'Jingle', code: 'J' },
          { type: 'Music', code: 'M' },
          { type: 'Music', code: 'M' },
          { type: 'Music', code: 'M' },
        ];
      default:
        throw new Error(`Invalid pattern type: ${type}`);
    }
  }

  getSequence(): PatternSlot[] {
    return [...this.sequence];
  }

  isValidForSecondSet(seventhPositionCategory: string): boolean {
    if (this.patternType !== MusicSetPattern.I) {
      return true;
    }
    return ['G', 'SD'].includes(seventhPositionCategory);
  }

  isValidForFirstSet(seventhPositionCategory: string): boolean {
    if (this.patternType !== MusicSetPattern.I) {
      return true;
    }
    return ['PB', 'M'].includes(seventhPositionCategory);
  }

  isValidCategoryAfterJingle(category: string): boolean {
    return !Pattern.DATE_BASED_CATEGORIES.includes(category);
  }

  isValidCategoryForSlot(category: string, position: number): boolean {
    const slot = this.sequence[position];
    if (!slot) {
      return false;
    }

    switch (slot.type) {
      case 'Image':
        return category === 'I';
      case 'Jingle':
        return category === 'J';
      case 'Music':
        // Music slots can accept any category except 'I' and 'J'
        return category !== 'I' && category !== 'J';
      default:
        return false;
    }
  }

  canBeUsedWithPatternI(setNumber: number): boolean {
    // If this is Pattern I, it can't be used if another Pattern I is used
    if (this.patternType === MusicSetPattern.I) {
      return false;
    }
    // Patterns II and III can always be used with Pattern I
    return true;
  }

  getType(): MusicSetPattern {
    return this.patternType;
  }

  /**
   * Finds all positions after jingles in the sequence
   * Useful for validating category placement
   */
  getPositionsAfterJingles(): number[] {
    const positions: number[] = [];
    for (let i = 0; i < this.sequence.length - 1; i++) {
      if (this.sequence[i].type === 'Jingle') {
        positions.push(i + 1);
      }
    }
    return positions;
  }

  /**
   * Validates if a sequence of categories fits this pattern
   * @param categories Array of category codes in sequence
   * @returns boolean indicating if sequence is valid
   */
  validateCategorySequence(categories: string[]): boolean {
    if (categories.length !== this.sequence.length) {
      return false;
    }

    // Check each position
    for (let i = 0; i < categories.length; i++) {
      if (!this.isValidCategoryForSlot(categories[i], i)) {
        return false;
      }

      // Check if this position is after a jingle
      if (i > 0 && this.sequence[i - 1].type === 'Jingle') {
        if (!this.isValidCategoryAfterJingle(categories[i])) {
          return false;
        }
      }
    }

    return true;
  }
}
