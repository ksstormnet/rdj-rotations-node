import fs from 'fs';
import path from 'path';
import { RuleManager } from '../../../src/business/rule';
import { CategoryCode } from '../../../src/models/rotationCodes';
import { BusinessError, ValidationError } from '../../../src/utils/errors';

jest.mock('fs');
jest.mock('../../../src/utils/logger');

describe('RuleManager', () => {
  let ruleManager: RuleManager;
  const mockRulesPath = path.join(process.cwd(), 'schedule-rules.json');

  const mockValidRules = {
    categories: {
      music: {
        image: {
          I: {
            description: 'Image - Always begins a music set',
          },
        },
        dateBased: {
          CE: {
            description: 'Core Early - 1978-1983',
            hourlyRequirement: { exact: 2 },
          },
          CM: {
            description: 'Core Mid - 1984-1988',
            hourlyRequirement: { exact: 2 },
          },
        },
      },
      nonMusic: {
        TOH: {
          description: 'Top of Hour Promo',
          position: 'fixed',
          order: 2,
        },
      },
    },
    musicSets: {
      firstTwoSets: {
        patterns: {
          Pattern_I: {
            sequence: [
              'I',
              'Music',
              'Jingle',
              'Music',
              'Music',
              'Jingle',
              'Music',
            ],
          },
        },
      },
      thirdSet: {
        sequence: ['I', 'Music', 'Jingle', 'Music', 'Music', 'PB'],
        rules: {
          position5: ['SP', 'SR', 'SD', 'SCo'] as CategoryCode[],
          position6: ['PB'] as CategoryCode[],
        },
      },
      patternConstraints: {},
    },
    commercialBreaks: {
      patterns: {
        '631': {
          sequence: [60, 30, 15],
          duration: 105,
        },
      },
      rules: {
        duration: { min: 75, max: 120 },
        hourlyRequirements: {
          fifteenSecondSpot: { minimum: 1 },
        },
      },
    },
    validationRules: {
      placement: {
        noConsecutive: ['CE', 'CM', 'CL'] as CategoryCode[],
        requireSeparator: ['CE', 'CM', 'CL'] as CategoryCode[],
        postJingle: ['CE', 'CM', 'CL'] as CategoryCode[],
        specialPositions: {},
      },
      categoryCompatibility: {},
      hourRequirements: {},
      pattern: {},
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the singleton instance
    (RuleManager as any).instance = undefined;
    (fs.readFileSync as jest.Mock).mockReturnValue(
      JSON.stringify(mockValidRules)
    );
  });

  afterEach(() => {
    jest.resetModules();
  });

  describe('getInstance()', () => {
    test('should create singleton instance', () => {
      const instance1 = RuleManager.getInstance();
      const instance2 = RuleManager.getInstance();
      expect(instance1).toBe(instance2);
    });

    test('should load rules successfully', () => {
      const instance = RuleManager.getInstance();
      expect(instance).toBeDefined();
      expect(fs.readFileSync).toHaveBeenCalledWith(mockRulesPath, 'utf8');
    });

    test('should throw BusinessError when rules file is missing', () => {
      (fs.readFileSync as jest.Mock).mockImplementation(() => {
        const error = new Error('ENOENT');
        (error as NodeJS.ErrnoException).code = 'ENOENT';
        throw error;
      });

      expect(() => RuleManager.getInstance()).toThrow(BusinessError);
    });

    test('should throw ValidationError for invalid JSON', () => {
      (fs.readFileSync as jest.Mock).mockReturnValue('invalid json');

      expect(() => RuleManager.getInstance()).toThrow(ValidationError);
    });
  });

  describe('Category Rules', () => {
    beforeEach(() => {
      ruleManager = RuleManager.getInstance();
    });

    test('should validate CE category rules', () => {
      const rules = ruleManager.getCategoryRules('CE' as CategoryCode);
      expect(rules).toMatchObject({
        description: 'Core Early - 1978-1983',
        hourlyRequirement: { exact: 2 },
      });
    });

    test('should validate I category rules', () => {
      const rules = ruleManager.getCategoryRules('I' as CategoryCode);
      expect(rules).toMatchObject({
        description: 'Image - Always begins a music set',
      });
    });

    test('should throw ValidationError for unknown category', () => {
      expect(() =>
        ruleManager.getCategoryRules('UNKNOWN' as CategoryCode)
      ).toThrow(ValidationError);
    });

    test('should validate category frequency requirements', () => {
      const frequencies = ruleManager.getCategoryFrequencies();
      expect(frequencies).toMatchObject({
        CE: { exact: 2 },
        CM: { exact: 2 },
      });
    });
  });

  describe('Pattern Rules', () => {
    beforeEach(() => {
      ruleManager = RuleManager.getInstance();
    });

    test('should validate Pattern_I definition', () => {
      const pattern = ruleManager.getMusicSetPattern('Pattern_I');
      expect(pattern.sequence).toHaveLength(7);
      expect(pattern.sequence[0]).toBe('I');
    });

    test('should validate first two sets patterns', () => {
      const patterns = ruleManager.getFirstTwoSetsPatterns();
      expect(patterns).toHaveProperty('Pattern_I');
    });

    test('should throw ValidationError for unknown pattern', () => {
      expect(() => ruleManager.getMusicSetPattern('UNKNOWN')).toThrow(
        ValidationError
      );
    });
    test('should get complete pattern rules structure', () => {
       const patternRules = RuleManager.getPatternRules();
       expect(patternRules).toBeDefined();
       expect(patternRules.patterns).toBeDefined();
       expect(patternRules.patterns.Pattern_I).toMatchObject({
         sequence: ['I', 'Music', 'Jingle', 'Music', 'Music', 'Jingle', 'Music'],
         requirements: {
           secondSet: {
             requiredWhen: {
               seventhElement: expect.arrayContaining(['G', 'SD'])
             }
           },
           firstSet: {
             allowedWhen: {
               seventhElement: expect.arrayContaining(['PB', 'M'])
             }
           }
         }
       });
     });
   
     test('should validate pattern requirements for position', () => {
       const positionRules = RuleManager.getPatternRequirementsForPosition(Position.SECOND_SET);
       expect(positionRules).toBeDefined();
       expect(positionRules.Pattern_I).toHaveProperty('requiredWhen');
     });
   
     test('should validate jingle positions for patterns', () => {
       const pattern = ruleManager.getMusicSetPattern('Pattern_I');
       expect(pattern.sequence).toEqual(
         expect.arrayContaining(['Jingle'])
       );
       expect(pattern.sequence.filter(el => el === 'Jingle')).toHaveLength(2);
     });
   
     test('should validate position-specific category constraints', () => {
       const thirdSetRules = ruleManager.getThirdSetRules();
       expect(thirdSetRules.rules.position5).toEqual(
         expect.arrayContaining(['SP', 'SR', 'SD', 'SCo'])
       );
     });
   });
  });

  describe('Position Rules', () => {
    beforeEach(() => {
      RuleManager = RuleManager.getInstance();
    });

    test('should validate fixed position rules', () => {
      const rules = RuleManager.getFixedPositionRules();
      expect(rules).toHaveProperty('TOH');
      expect(rules.TOH.order).toBe(2);
    });

    test('should identify categories valid for position', () => {
      const validCategories = RuleManager.getValidCategoriesForPosition(0);
      expect(validCategories).toContain('CE');
      expect(validCategories).toContain('CM');
    });
  });

  describe('Commercial Break Rules', () => {
    beforeEach(() => {
      RuleManager = RuleManager.getInstance();
    });
    test('should get commercial pattern rules', () => {
      const pattern = RuleManager.getCommercialPatternRules('631');
      expect(pattern).toMatchObject({
        sequence: [60, 30, 15],
        duration: 105,
      });
    });
    test('should throw ValidationError for unknown commercial pattern', () => {
      expect(() => RuleManager.getCommercialPatternRules('999')).toThrow(
        ValidationError
      );
    });
    test('should get commercial break constraints', () => {
      const constraints = RuleManager.getCommercialBreakConstraints();
      expect(constraints).toMatchObject({
        duration: { min: 75, max: 120 },
        hourlyRequirements: {
          fifteenSecondSpot: { minimum: 1 },
        },
      });
    });
    test('should provide default constraints when not defined', () => {
      // Create rules without commercialBreaks
      const tempRules = {
        ...mockValidRules,
        commercialBreaks: undefined,
      };
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(tempRules));
      // Reset singleton for this test
      (RuleManager as any).instance = undefined;
      const instance = RuleManager.getInstance();
      const constraints = instance.getCommercialBreakConstraints();
      expect(constraints).toMatchObject({
        duration: { min: 75, max: 120 },
        hourlyRequirements: {
          fifteenSecondSpot: { minimum: 1 },
        },
      });
    });
  }); // Added closing brace for Commercial Break Rules

  describe('Category Placement Rules', () => {
    beforeEach(() => {
      RuleManager = RuleManager.getInstance();
    });
    test('should get category placement rules', () => {
      const rules = RuleManager.getCategoryPlacementRules();
      expect(rules.noConsecutive).toContain('CE' as CategoryCode);
      expect(rules.requireSeparator).toContain('CM' as CategoryCode);
      expect(rules.postJingle).toContain('CL' as CategoryCode);
    });
    test('should get category compatibility rules', () => {
      const compatibility = RuleManager.getCategoryCompatibility(
        'CE' as CategoryCode
      );
      expect(compatibility).toHaveProperty('cannotFollow');
      expect(compatibility).toHaveProperty('mustFollow');
    });
    test('should provide empty arrays for undefined compatibility rules', () => {
      const compatibility = RuleManager.getCategoryCompatibility(
        'UNKNOWN' as CategoryCode
      );
      expect(compatibility.cannotFollow).toEqual([]);
      expect(compatibility.mustFollow).toEqual([]);
    });
    test('should provide default arrays when placement rules undefined', () => {
      // Create rules without placement rules
      const tempRules = {
        ...mockValidRules,
        validationRules: {
          ...mockValidRules.validationRules,
          placement: undefined,
        },
      };
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(tempRules));
      // Reset singleton for this test
      (RuleManager as any).instance = undefined;
      const instance = RuleManager.getInstance();
      const rules = instance.getCategoryPlacementRules();
      expect(Array.isArray(rules.noConsecutive)).toBe(true);
      expect(Array.isArray(rules.requireSeparator)).toBe(true);
      expect(Array.isArray(rules.postJingle)).toBe(true);
      expect(rules.specialPositions).toBeDefined();
    });
  }); // Added closing brace for Category Placement Rules
  describe('Third Set Rules', () => {
    beforeEach(() => {
      RuleManager = RuleManager.getInstance();
    });

    test('should get third set rules', () => {
      const rules = RuleManager.getThirdSetRules();
      expect(rules.sequence).toHaveLength(6);
      expect(rules.rules.position5).toContain('SP' as CategoryCode);
      expect(rules.rules.position6).toEqual(['PB' as CategoryCode]);
    });

    test('should throw ValidationError when third set rules not defined', () => {
      // Create rules without third set
      const tempRules = {
        ...mockValidRules,
        musicSets: {
          ...mockValidRules.musicSets,
          thirdSet: undefined,
        },
      };
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(tempRules));

      // Reset singleton for this test
      (RuleManager as any).instance = undefined;
      const instance = RuleManager.getInstance();

      expect(() => instance.getThirdSetRules()).toThrow(ValidationError);
    });

    test('should get third set position requirements', () => {
      const requirements = RuleManager.getThirdSetPositionRequirements();
      expect(requirements.position5).toContain('SP' as CategoryCode);
      expect(requirements.position6).toContain('PB' as CategoryCode);
    });

    test('should provide empty arrays when position requirements undefined', () => {
      // Create rules without third set rules
      const tempRules = {
        ...mockValidRules,
        musicSets: {
          ...mockValidRules.musicSets,
          thirdSet: {
            ...mockValidRules.musicSets.thirdSet!,
            rules: undefined,
          },
        },
      };
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(tempRules));

      // Reset singleton for this test
      (RuleManager as any).instance = undefined;
      const instance = RuleManager.getInstance();

      const requirements = instance.getThirdSetPositionRequirements();
      expect(Array.isArray(requirements.position5)).toBe(true);
      expect(Array.isArray(requirements.position6)).toBe(true);
    });

    describe('Enhanced Validation Rules', () => {
      beforeEach(() => {
        RuleManager = RuleManager.getInstance();
      });

      test('should get hourly requirements', () => {
        const requirements = RuleManager.getHourlyRequirements();
        expect(requirements).toHaveProperty('categoryFrequencies');
        expect(requirements).toHaveProperty('specialtyRequirements');
        expect(requirements).toHaveProperty('pattern');
      });

      test('should return empty constraints when none defined', () => {
        // Using existing mock data which has no constraints defined
        const constraints = ruleManager.getPatternConstraints(0);
        expect(constraints).toEqual({});
      });

      test('should return pattern constraints when defined', () => {
        // Create temporary rules with constraints
        const tempRules = {
          ...mockValidRules,
          musicSets: {
            ...mockValidRules.musicSets,
            patternConstraints: {
              0: {
                allowed: ['Pattern_I', 'Pattern_II'],
                required: ['Pattern_I'],
                forbidden: ['Pattern_III'],
              },
            },
          },
        };
        (fs.readFileSync as jest.Mock).mockReturnValue(
          JSON.stringify(tempRules)
        );
      });
      test('should validate required sections are complete', () => {
        const instance = RuleManager.getInstance();
        expect(() => instance.validateRuleCompleteness()).not.toThrow();
      });

      test('should validate all category references are valid', () => {
        // Add test for validateCategoryDefinitions
        const instance = RuleManager.getInstance();
        expect(() =>
          (instance as any).validateCategoryDefinitions()
        ).not.toThrow();
      });
    });

    describe('Rule Validation', () => {
      test('should detect missing required rule sections', () => {
        const invalidRules = { categories: {} }; // Missing musicSets
        (fs.readFileSync as jest.Mock).mockReturnValue(
          JSON.stringify(invalidRules)
        );

        // Reset singleton for this test
        (RuleManager as any).instance = undefined;

        expect(() => RuleManager.getInstance()).toThrow(ValidationError);
      });

      test('should validate category relationships', () => {
        const instance = RuleManager.getInstance();
        expect(() => instance.validateCategoryRelationships()).not.toThrow();
      });

      test('should validate rule completeness', () => {
        const instance = RuleManager.getInstance();
        expect(() => instance.validateRuleCompleteness()).not.toThrow();
      });
    });
  });
});
