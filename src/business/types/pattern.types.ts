// src/business/types/pattern.types.ts

import { CategoryCode } from '../../models/rotationCodes';

export enum PatternType {
  PATTERN_I = 'PATTERN_I',
  PATTERN_II = 'PATTERN_II',
  PATTERN_III = 'PATTERN_III',
  THIRD_SET = 'THIRD_SET',
}

export enum Position {
  FIRST_SET = 'FIRST_SET',
  SECOND_SET = 'SECOND_SET',
  THIRD_SET = 'THIRD_SET',
}

export interface ValidationResult {
  valid: boolean;
  violations: string[];
}

export interface PatternRequirement {
  position: number;
  allowedCategories: CategoryCode[];
  conditions?: {
    category?: CategoryCode;
    position?: number;
  };
}

export interface PatternDefinition {
  type: PatternType;
  sequence: CategoryCode[];
  requirements?: PatternRequirement[];
}

export interface PatternRules {
  patterns: {
    [key in PatternType]: {
      sequence: CategoryCode[];
      requirements: {
        [key: string]: {
          requiredWhen?: {
            seventhElement?: CategoryCode[];
          };
          allowedWhen?: {
            seventhElement?: CategoryCode[];
          };
          fifthPosition?: CategoryCode[];
        };
      };
    };
  };
}

export interface PatternPositionRequirements {
  [patternType: string]: {
    requiredWhen?: {
      seventhElement?: CategoryCode[];
    };
    allowedWhen?: {
      seventhElement?: CategoryCode[];
    };
  } | {
    sequence: string[];
    rules: {
      position5: CategoryCode[];
      position6: CategoryCode[];
    };
  };
}