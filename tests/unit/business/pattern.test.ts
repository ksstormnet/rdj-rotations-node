// tests/unit/business/pattern.test.ts

import { MusicSetPattern } from '../../../src/business/pattern';
import { PatternType, Position } from '../../../src/business/types/pattern.types';

// Mock RuleManager
jest.mock('../../../src/business/rule', () => ({
  RuleManager: {
    getInstance: jest.fn().mockReturnValue({
      getPatternRules: jest.fn().mockReturnValue({
        patterns: {
          PATTERN_I: {
            sequence: ['I', 'MUSIC', 'JINGLE', 'MUSIC', 'MUSIC', 'JINGLE', 'MUSIC'],
            requirements: {
              secondSet: {
                requiredWhen: {
                  seventhElement: ['G', 'SD']
                }
              },
              firstSet: {
                allowedWhen: {
                  seventhElement: ['PB', 'M']
                }
              }
            }
          },
          THIRD_SET: {
            sequence: ['I', 'MUSIC', 'JINGLE', 'MUSIC', 'MUSIC', 'PB'],
            requirements: {
              fifthPosition: ['SP', 'SR', 'SD', 'SCo']
            }
          }
        }
      })
    })
  }
}));

describe('MusicSetPattern', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Pattern Validation', () => {
    test('should validate Pattern I structure', () => {
      const pattern = new MusicSetPattern({
        type: PatternType.PATTERN_I,
        sequence: ['I', 'CE', 'B', 'CM', 'CL', 'tM', 'G']
      });

      expect(pattern.isValid()).toBe(true);
    });

    test('should reject invalid Pattern I structure', () => {
      const pattern = new MusicSetPattern({
        type: PatternType.PATTERN_I,
        sequence: ['I', 'CE', 'CM', 'B', 'CL', 'G'] // Wrong sequence
      });

      const result = pattern.isValid();
      expect(result.valid).toBe(false);
      expect(result.violations).toContain('Invalid pattern length');
    });

    test('should validate jingle positions in Pattern I', () => {
      const pattern = new MusicSetPattern({
        type: PatternType.PATTERN_I,
        sequence: ['I', 'CE', 'CM', 'B', 'CL', 'G', 'M'] // Jingles in wrong positions
      });

      const result = pattern.isValid();
      expect(result.valid).toBe(false);
      expect(result.violations).toContain('Invalid jingle position');
    });
  });

  describe('Position Rules', () => {
    test('should allow Pattern I in first set with PB in seventh position', () => {
      const pattern = new MusicSetPattern({
        type: PatternType.PATTERN_I,
        sequence: ['I', 'CE', 'B', 'CM', 'CL', 'tM', 'PB']
      });

      expect(pattern.isValidForPosition(Position.FIRST_SET).valid).toBe(true);
    });

    test('should require Pattern I in second set with G in seventh position', () => {
      const pattern = new MusicSetPattern({
        type: PatternType.PATTERN_II,
        sequence: ['I', 'CE', 'CM', 'B', 'CL', 'M', 'G']
      });

      const result = pattern.isValidForPosition(Position.SECOND_SET);
      expect(result.valid).toBe(false);
      expect(result.violations).toContain('Pattern I required when G is in seventh position');
    });
  });

  describe('Category Placement Rules', () => {
    test('should validate category placement within pattern', () => {
      const pattern = new MusicSetPattern({
        type: PatternType.PATTERN_I,
        sequence: ['I', 'CE', 'B', 'CM', 'CL', 'tM', 'G']
      });

      expect(pattern.validateCategoryPlacements().valid).toBe(true);
    });

    test('should reject date-based category after jingle', () => {
      const pattern = new MusicSetPattern({
        type: PatternType.PATTERN_I,
        sequence: ['I', 'SP', 'B', 'CE', 'CL', 'tM', 'M']
      });

      const result = pattern.validateCategoryPlacements();
      expect(result.valid).toBe(false);
      expect(result.violations).toContain('Date-based category CE cannot be placed after jingle');
    });
  });
});
