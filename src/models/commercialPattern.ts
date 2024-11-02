export type SpotDuration = 15 | 30 | 60;

export class CommercialPattern {
  private readonly validPatterns = ['631', '633', '613', '63', '61', '331'];
  private readonly maxDuration = 120;
  private readonly minDuration = 75;
  
  private sequence: SpotDuration[];
  private patternCode: string;

  constructor(code: string) {
    // Validate length first
    if (code.length > 3) {
      throw new Error('Invalid pattern length');
    }

    // First check if it's a valid pattern
    if (!this.validPatterns.includes(code)) {
      throw new Error(`Invalid commercial pattern: ${code}`);
    }

    this.patternCode = code;
    this.sequence = this.parsePattern(code);

    // Calculate and validate duration
    const totalDuration = this.getTotalDuration();
    if (totalDuration > this.maxDuration) {
      throw new Error('Total duration exceeds maximum');
    }
  }

  private parsePattern(code: string): SpotDuration[] {
    const digitToSpotDuration: Record<string, SpotDuration> = {
      '1': 15,  // 1 unit = 15 seconds
      '3': 30,  // 2 units = 30 seconds
      '6': 60   // 4 units = 60 seconds
    };

    return code.split('').map(char => {
      const duration = digitToSpotDuration[char];
      if (!duration) {
        throw new Error(`Invalid spot duration for digit: ${char}`);
      }
      return duration;
    });
  }

  getSequence(): SpotDuration[] {
    return [...this.sequence];
  }

  getTotalDuration(): number {
    return this.sequence.reduce((sum, duration) => sum + duration, 0);
  }

  has15SecondSpot(): boolean {
    return this.sequence.includes(15);
  }

  get15SecondPosition(): number {
    return this.sequence.indexOf(15);
  }

  isValid(): boolean {
    try {
      const totalDuration = this.getTotalDuration();
      return totalDuration >= this.minDuration && 
             totalDuration <= this.maxDuration &&
             this.validPatterns.includes(this.patternCode);
    } catch {
      return false;
    }
  }

  getPatternCode(): string {
    return this.patternCode;
  }

  static areCompatible(first: CommercialPattern, second: CommercialPattern): boolean {
    // Patterns must be different
    if (first.getPatternCode() === second.getPatternCode()) {
      return false;
    }

    // Total duration of both breaks must not exceed maximum allowed
    const totalDuration = first.getTotalDuration() + second.getTotalDuration();
    return totalDuration <= first.maxDuration * 2;
  }

  static hasValid15SecondPlacement(first: CommercialPattern, second: CommercialPattern): boolean {
    const firstValid = first.has15SecondSpot() && 
      [1, 2].includes(first.get15SecondPosition());
    const secondValid = second.has15SecondSpot() && 
      [1, 2].includes(second.get15SecondPosition());

    return firstValid || secondValid;
  }

  static isValidHourCombination(first: CommercialPattern, second: CommercialPattern): boolean {
    return CommercialPattern.areCompatible(first, second) && 
           CommercialPattern.hasValid15SecondPlacement(first, second);
  }

  static getValidHourCombinations(): [string, string][] {
    const validCombos: [string, string][] = [];
    const pattern = new CommercialPattern('631');
    const allPatterns = pattern.validPatterns;

    for (let i = 0; i < allPatterns.length; i++) {
      for (let j = i + 1; j < allPatterns.length; j++) {
        const first = new CommercialPattern(allPatterns[i]);
        const second = new CommercialPattern(allPatterns[j]);

        if (CommercialPattern.isValidHourCombination(first, second)) {
          validCombos.push([allPatterns[i], allPatterns[j]]);
        }
      }
    }

    return validCombos;
  }

  toString(): string {
    return this.sequence.join('-');
  }

  isValidFirstBreak(): boolean {
    return this.getTotalDuration() <= this.maxDuration;
  }

  getCompatibleSecondBreaks(): string[] {
    return this.validPatterns.filter(code => {
      try {
        const secondBreak = new CommercialPattern(code);
        return CommercialPattern.isValidHourCombination(this, secondBreak);
      } catch {
        return false;
      }
    });
  }

  /**
   * Validates if the pattern can be used as a complete break
   * All spots must be present and in correct order
   */
  isValidBreak(): boolean {
    return this.isValid() && this.sequence.length > 0;
  }

  /**
   * Gets the number of spots in the pattern
   */
  getSpotCount(): number {
    return this.sequence.length;
  }

  /**
   * Checks if this pattern can be used in the first half of the hour
   */
  isValidForFirstHalf(): boolean {
    return this.isValidBreak() && this.getTotalDuration() <= this.maxDuration;
  }

  /**
   * Checks if this pattern can be used in the second half of the hour
   */
  isValidForSecondHalf(): boolean {
    return this.isValidBreak() && this.getTotalDuration() <= this.maxDuration;
  }
}