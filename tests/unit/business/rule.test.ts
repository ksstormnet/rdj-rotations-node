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
                        description: "Image - Always begins a music set"
                    }
                },
                dateBased: {
                    CE: {
                        description: "Core Early - 1978-1983",
                        hourlyRequirement: { exact: 2 }
                    },
                    CM: {
                        description: "Core Mid - 1984-1988",
                        hourlyRequirement: { exact: 2 }
                    }
                }
            },
            nonMusic: {
                TOH: {
                    description: "Top of Hour Promo",
                    position: "fixed",
                    order: 2
                }
            }
        },
        musicSets: {
            firstTwoSets: {
                patterns: {
                    Pattern_I: {
                        sequence: ["I", "Music", "Jingle", "Music", "Music", "Jingle", "Music"]
                    }
                }
            }
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockValidRules));
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
                throw new Error('ENOENT');
            });

            expect(() => RuleManager.getInstance())
                .toThrow(BusinessError);
        });

        test('should throw ValidationError for invalid JSON', () => {
            (fs.readFileSync as jest.Mock).mockReturnValue('invalid json');

            expect(() => RuleManager.getInstance())
                .toThrow(ValidationError);
        });
    });

    describe('Category Rules', () => {
        beforeEach(() => {
            ruleManager = RuleManager.getInstance();
        });

        test('should validate CE category rules', () => {
            const rules = ruleManager.getCategoryRules('CE' as CategoryCode);
            expect(rules).toMatchObject({
                description: "Core Early - 1978-1983",
                hourlyRequirement: { exact: 2 }
            });
        });

        test('should validate I category rules', () => {
            const rules = ruleManager.getCategoryRules('I' as CategoryCode);
            expect(rules).toMatchObject({
                description: "Image - Always begins a music set"
            });
        });

        test('should throw ValidationError for unknown category', () => {
            expect(() => ruleManager.getCategoryRules('UNKNOWN' as CategoryCode))
                .toThrow(ValidationError);
        });

        test('should validate category frequency requirements', () => {
            const frequencies = ruleManager.getCategoryFrequencies();
            expect(frequencies).toMatchObject({
                CE: { exact: 2 },
                CM: { exact: 2 }
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
            expect(() => ruleManager.getMusicSetPattern('UNKNOWN'))
                .toThrow(ValidationError);
        });
    });

    describe('Position Rules', () => {
        beforeEach(() => {
            ruleManager = RuleManager.getInstance();
        });

        test('should validate fixed position rules', () => {
            const rules = ruleManager.getFixedPositionRules();
            expect(rules).toHaveProperty('TOH');
            expect(rules.TOH.order).toBe(2);
        });

        test('should identify categories valid for position', () => {
            const validCategories = ruleManager.getValidCategoriesForPosition(0);
            expect(validCategories).toContain('CE');
            expect(validCategories).toContain('CM');
        });
    });

    describe('Rule Validation', () => {
        test('should detect missing required rule sections', () => {
            const invalidRules = { categories: {} }; // Missing musicSets
            (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(invalidRules));

            expect(() => RuleManager.getInstance())
                .toThrow(ValidationError);
        });

        test('should validate category relationships', () => {
            const instance = RuleManager.getInstance();
            expect(() => instance.validateCategoryRelationships())
                .not.toThrow();
        });

        test('should validate rule completeness', () => {
            const instance = RuleManager.getInstance();
            expect(() => instance.validateRuleCompleteness())
                .not.toThrow();
        });
    });
});
