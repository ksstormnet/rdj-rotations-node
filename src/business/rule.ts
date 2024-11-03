import fs from 'fs';
import path from 'path';
import { CategoryCode } from '../models/rotationCodes';
import { BusinessError, ValidationError } from '../utils/errors';
import { Logger } from '../utils/logger';
const logger = new Logger('RuleManager');

/**
 * Interfaces representing the structure of schedule-rules.json
 */
interface CategoryRule {
  description: string;
  hourlyRequirement?: {
    exact?: number;
    minimum?: number;
    maximum?: number;
  };
  position?: string;
  order?: number;
}

interface MusicSetPattern {
  sequence: string[];
  rules?: {
    usage?: {
      maxPerHour?: number;
      preferredSet?: string;
      requiredWhen?: Record<string, string[]>;
    };
  };
}

interface Rules {
  categories: {
    music: {
      image: Record<string, CategoryRule>;
      dateBased: Record<string, CategoryRule>;
      soundBased?: Record<string, CategoryRule>;
    };
    nonMusic: Record<string, CategoryRule>;
  };
  musicSets: {
    firstTwoSets: {
      patterns: Record<string, MusicSetPattern>;
    };
    thirdSet?: {
      sequence: string[];
      rules: {
        position5: CategoryCode[];
        position6: CategoryCode[];
      };
    };
    patternConstraints?: Record<number, PatternConstraints>; // Add this
  };
  commercialBreaks: {
    patterns: Record<string, CommercialPatternRule>;
    rules: CommercialBreakConstraints;
  };
  validationRules: {
    placement: CategoryPlacementRules;
    categoryCompatibility: Record<CategoryCode, CompatibilityRules>;
    hourRequirements: Record<
      CategoryCode,
      { min?: number; max?: number; exact?: number }
    >;
    pattern: Record<string, unknown>;
  };
}

interface CommercialPatternRule {
  sequence: number[];
  duration: number;
}

interface CommercialBreakConstraints {
  duration: {
    min: number;
    max: number;
  };
  hourlyRequirements: {
    fifteenSecondSpot: {
      minimum: number;
    };
  };
}

interface CategoryPlacementRules {
  noConsecutive: CategoryCode[];
  requireSeparator: CategoryCode[];
  postJingle: CategoryCode[];
  specialPositions: Record<number, CategoryCode[]>;
}

interface CompatibilityRules {
  cannotFollow: CategoryCode[];
  mustFollow: CategoryCode[];
}

interface ThirdSetRules {
  sequence: string[];
  rules: {
    position5: CategoryCode[];
    position6: CategoryCode[];
  };
}

interface PositionRequirements {
  position5: CategoryCode[];
  position6: CategoryCode[];
}

interface HourlyRequirements {
  categoryFrequencies: Record<
    CategoryCode,
    { min?: number; max?: number; exact?: number }
  >;
  specialtyRequirements: Record<string, unknown>;
  pattern: Record<string, unknown>;
}

interface PatternConstraints {
  allowed?: string[];
  required?: string[];
  forbidden?: string[];
}

/**
 * Manages loading and access to radio rotation rules
 */
export class RuleManager {
  private static instance: RuleManager;
  private rules: Rules;
  private readonly rulesPath: string;

  private constructor() {
    this.rulesPath = path.join(process.cwd(), 'schedule-rules.json');
    this.rules = this.loadRules();
    this.validateRules();
  }

  /**
   * Gets the singleton instance of RuleManager
   */
  public static getInstance(): RuleManager {
    if (!RuleManager.instance) {
      RuleManager.instance = new RuleManager();
    }
    return RuleManager.instance;
  }

  /**
   * Gets rules for a specific category
   */
  public getCategoryRules(category: CategoryCode): CategoryRule {
    logger.debug(`Getting rules for category: ${category}`);

    // Search in all category sections
    const rule = this.findCategoryInSections(category);

    if (!rule) {
      throw new ValidationError(`Unknown category: ${category}`, {
        category,
        availableCategories: this.getAllCategoryNames(),
      });
    }

    return rule;
  }

  /**
   * Gets all category frequency requirements
   */
  public getCategoryFrequencies(): Record<
    string,
    { exact?: number; minimum?: number; maximum?: number }
  > {
    const frequencies: Record<string, any> = {};

    // Collect from dateBased categories
    Object.entries(this.rules.categories.music.dateBased).forEach(
      ([category, rule]) => {
        if (rule.hourlyRequirement) {
          frequencies[category] = rule.hourlyRequirement;
        }
      }
    );

    return frequencies;
  }

  /**
   * Gets a specific music set pattern
   */
  public getMusicSetPattern(patternName: string): MusicSetPattern {
    const pattern = this.rules.musicSets.firstTwoSets.patterns[patternName];

    if (!pattern) {
      throw new ValidationError(`Unknown pattern: ${patternName}`, {
        pattern: patternName,
        availablePatterns: Object.keys(
          this.rules.musicSets.firstTwoSets.patterns
        ),
      });
    }

    return pattern;
  }

  /**
   * Gets patterns available for first two sets
   */
  public getFirstTwoSetsPatterns(): Record<string, MusicSetPattern> {
    return this.rules.musicSets.firstTwoSets.patterns;
  }

  /**
   * Gets rules for positions with fixed requirements
   */
  public getFixedPositionRules(): Record<string, CategoryRule> {
    return Object.entries(this.rules.categories.nonMusic)
      .filter(([_, rule]) => rule.position === 'fixed')
      .reduce((acc, [category, rule]) => ({ ...acc, [category]: rule }), {});
  }

  /**
   * Gets valid categories for a specific position
   */
  public getValidCategoriesForPosition(position: number): CategoryCode[] {
    // Implement position-specific logic based on rules
    if (position === 0) {
      return Object.keys(
        this.rules.categories.music.dateBased
      ) as CategoryCode[];
    }
    // Add more position-specific logic as needed
    return [];
  }

  private createEmptyCategoryRecord<T>(): Record<CategoryCode, T> {
    return {} as Record<CategoryCode, T>;
  }

  // Commercial Break Methods
  public getCommercialPatternRules(pattern: string): CommercialPatternRule {
    const patterns = this.rules.commercialBreaks?.patterns;
    if (!patterns?.[pattern]) {
      throw new ValidationError(`Unknown commercial pattern: ${pattern}`, {
        pattern,
        availablePatterns: Object.keys(patterns || {}),
      });
    }
    return patterns[pattern];
  }

  public getCommercialBreakConstraints(): CommercialBreakConstraints {
    if (!this.rules.commercialBreaks?.rules) {
      return {
        duration: { min: 75, max: 120 },
        hourlyRequirements: {
          fifteenSecondSpot: { minimum: 1 },
        },
      };
    }
    return this.rules.commercialBreaks.rules;
  }

  // Category Placement Methods
  public getCategoryPlacementRules(): CategoryPlacementRules {
    const defaultCategories: CategoryCode[] = [];
    return {
      // Changed from noConsecutiveDateBased to match interface
      noConsecutive:
        (this.rules.validationRules?.placement
          ?.noConsecutive as CategoryCode[]) || // Changed here too
        defaultCategories,
      requireSeparator:
        (this.rules.validationRules?.placement
          ?.requireSeparator as CategoryCode[]) || defaultCategories,
      postJingle:
        (this.rules.validationRules?.placement?.postJingle as CategoryCode[]) ||
        defaultCategories,
      specialPositions:
        this.rules.validationRules?.placement?.specialPositions || {},
    };
  }

  public getCategoryCompatibility(category: CategoryCode): CompatibilityRules {
    const rules = this.rules.validationRules?.categoryCompatibility;
    return (
      rules?.[category] || {
        cannotFollow: [] as CategoryCode[],
        mustFollow: [] as CategoryCode[],
      }
    );
  }

  // Third Set Methods
  public getThirdSetRules(): ThirdSetRules {
    if (!this.rules.musicSets?.thirdSet?.rules) {
      throw new ValidationError('Third set rules not defined');
    }
    return {
      sequence: this.rules.musicSets.thirdSet.sequence,
      rules: {
        position5: this.rules.musicSets.thirdSet.rules
          .position5 as CategoryCode[],
        position6: this.rules.musicSets.thirdSet.rules
          .position6 as CategoryCode[],
      },
    };
  }

  public getThirdSetPositionRequirements(): PositionRequirements {
    const defaultCategories: CategoryCode[] = [];
    const rules = this.rules.musicSets?.thirdSet?.rules;
    return {
      position5: (rules?.position5 as CategoryCode[]) || defaultCategories,
      position6: (rules?.position6 as CategoryCode[]) || defaultCategories,
    };
  }

  // Validation Rule Methods
  public getHourlyRequirements(): HourlyRequirements {
    return {
      categoryFrequencies:
        this.rules.validationRules?.hourRequirements ||
        this.createEmptyCategoryRecord<{
          min?: number;
          max?: number;
          exact?: number;
        }>(),
      specialtyRequirements: this.createEmptyCategoryRecord<unknown>(),
      pattern: this.createEmptyCategoryRecord<unknown>(),
    };
  }

  public getPatternConstraints(position: number): PatternConstraints {
    const constraints = this.rules.musicSets?.patternConstraints || {};
    return constraints[position] || {};
  }

  public validateCategoryRelationships(): void {
    logger.debug('Validating category relationships');
    // Implementation to be added
  }

  public validateRuleCompleteness(): void {
    logger.debug('Validating rule completeness');
    // Implementation to be added
  }

  private loadRules(): Rules {
    try {
      const content = fs.readFileSync(this.rulesPath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new BusinessError('Rules file not found', {
          path: this.rulesPath,
        });
      }

      if (error instanceof SyntaxError) {
        throw new ValidationError('Invalid JSON in rules file', {
          path: this.rulesPath,
          error: error.message,
        });
      }

      throw error;
    }
  }

  private validateRules(): void {
    this.validateRequiredSections();
    this.validateCategoryDefinitions();
  }

  private validateRequiredSections(): void {
    if (!this.rules.categories || !this.rules.musicSets) {
      throw new ValidationError('Missing required rule sections', {
        missingCategories: !this.rules.categories,
        missingMusicSets: !this.rules.musicSets,
      });
    }
  }

  private validateCategoryDefinitions(): void {
    logger.debug('Validating category definitions');
    // Implementation to be added
  }

  private findCategoryInSections(category: string): CategoryRule | undefined {
    const { music, nonMusic } = this.rules.categories;

    return (
      music.image[category] ||
      music.dateBased[category] ||
      (music.soundBased && music.soundBased[category]) ||
      nonMusic[category]
    );
  }

  private getAllCategoryNames(): string[] {
    const { music, nonMusic } = this.rules.categories;

    return [
      ...Object.keys(music.image),
      ...Object.keys(music.dateBased),
      ...(music.soundBased ? Object.keys(music.soundBased) : []),
      ...Object.keys(nonMusic),
    ];
  }
}
