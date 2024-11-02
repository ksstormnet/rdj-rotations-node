import { MusicSetPattern, Pattern } from '../../../src/models/pattern';

describe('Pattern', () => {
  describe('Pattern Creation and Validation', () => {
    it('should create Pattern I with correct sequence', () => {
      const patternI = new Pattern(MusicSetPattern.I);
      expect(patternI.getSequence()).toEqual([
        { type: 'Image', code: 'I' },
        { type: 'Music', code: 'M' },
        { type: 'Jingle', code: 'J' },
        { type: 'Music', code: 'M' },
        { type: 'Music', code: 'M' },
        { type: 'Jingle', code: 'J' },
        { type: 'Music', code: 'M' }
      ]);
    });

    it('should create Pattern II with correct sequence', () => {
      const patternII = new Pattern(MusicSetPattern.II);
      expect(patternII.getSequence()).toEqual([
        { type: 'Image', code: 'I' },
        { type: 'Music', code: 'M' },
        { type: 'Jingle', code: 'J' },
        { type: 'Music', code: 'M' },
        { type: 'Music', code: 'M' },
        { type: 'Music', code: 'M' },
        { type: 'Music', code: 'M' }
      ]);
    });

    it('should create Pattern III with correct sequence', () => {
      const patternIII = new Pattern(MusicSetPattern.III);
      expect(patternIII.getSequence()).toEqual([
        { type: 'Image', code: 'I' },
        { type: 'Music', code: 'M' },
        { type: 'Music', code: 'M' },
        { type: 'Jingle', code: 'J' },
        { type: 'Music', code: 'M' },
        { type: 'Music', code: 'M' },
        { type: 'Music', code: 'M' }
      ]);
    });
  });

  describe('Pattern I Constraints', () => {
    let patternI: Pattern;

    beforeEach(() => {
      patternI = new Pattern(MusicSetPattern.I);
    });

    it('should validate Pattern I seventh position with G category', () => {
      expect(patternI.isValidForSecondSet('G')).toBe(true);
    });

    it('should validate Pattern I seventh position with SD category', () => {
      expect(patternI.isValidForSecondSet('SD')).toBe(true);
    });

    it('should validate Pattern I first set with PB category', () => {
      expect(patternI.isValidForFirstSet('PB')).toBe(true);
    });

    it('should validate Pattern I first set with M category', () => {
      expect(patternI.isValidForFirstSet('M')).toBe(true);
    });

    it('should reject invalid categories for Pattern I seventh position', () => {
      expect(patternI.isValidForSecondSet('CE')).toBe(false);
    });
  });

  describe('Category Placement Rules', () => {
    let pattern: Pattern;

    beforeEach(() => {
      pattern = new Pattern(MusicSetPattern.I);
    });

    it('should not allow date-based categories after jingles', () => {
      const dateBased = ['CE', 'CM', 'CL', 'M', 'G'];
      dateBased.forEach(category => {
        expect(pattern.isValidCategoryAfterJingle(category)).toBe(false);
      });
    });

    it('should allow non-date-based categories after jingles', () => {
      const nonDateBased = ['SP', 'SR', 'SCh', 'SCo', 'PB'];
      nonDateBased.forEach(category => {
        expect(pattern.isValidCategoryAfterJingle(category)).toBe(true);
      });
    });

    it('should validate Image slot only accepts I category', () => {
      expect(pattern.isValidCategoryForSlot('I', 0)).toBe(true);
      expect(pattern.isValidCategoryForSlot('CE', 0)).toBe(false);
    });
  });

  describe('Pattern Compatibility', () => {
    it('should not allow Pattern I in both first and second sets', () => {
      const firstSet = new Pattern(MusicSetPattern.I);
      expect(firstSet.canBeUsedWithPatternI(1)).toBe(false);
    });

    it('should allow Pattern II and III in any set', () => {
      const patternII = new Pattern(MusicSetPattern.II);
      const patternIII = new Pattern(MusicSetPattern.III);

      expect(patternII.canBeUsedWithPatternI(1)).toBe(true);
      expect(patternII.canBeUsedWithPatternI(2)).toBe(true);
      expect(patternIII.canBeUsedWithPatternI(1)).toBe(true);
      expect(patternIII.canBeUsedWithPatternI(2)).toBe(true);
    });
  });
});
