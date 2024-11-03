/**
 * Base error class for the application.
 * Extends Error with additional context and error code capabilities.
 */
export class AppError extends Error {
  public readonly code: string;
  public readonly context: Record<string, unknown>;

  constructor(
    message: string,
    code: string,
    context: Record<string, unknown> = {}
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.context = context;

    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error class for business rule violations.
 * Used when operations violate defined business rules.
 */
export class BusinessError extends AppError {
  constructor(message: string, context: Record<string, unknown> = {}) {
    super(message, 'BUSINESS_ERROR', context);
  }
}

/**
 * Error class for validation failures.
 * Used when data fails schema or rule validation.
 */
export class ValidationError extends AppError {
  constructor(message: string, context: Record<string, unknown> = {}) {
    super(message, 'VALIDATION_ERROR', context);
  }
}

/**
 * Error class for configuration issues.
 * Used when there are problems with configuration files or settings.
 */
export class ConfigurationError extends AppError {
  constructor(message: string, context: Record<string, unknown> = {}) {
    super(message, 'CONFIGURATION_ERROR', context);
  }
}

/**
 * Error class for data access issues.
 * Used when there are problems accessing or manipulating data.
 */
export class DataError extends AppError {
  constructor(message: string, context: Record<string, unknown> = {}) {
    super(message, 'DATA_ERROR', context);
  }
}

/**
 * Creates a standardized error context object
 */
export function createErrorContext(
  details: unknown,
  source?: string,
  operation?: string
): Record<string, unknown> {
  return {
    timestamp: new Date().toISOString(),
    source: source || 'unknown',
    operation: operation || 'unknown',
    details,
  };
}

// Example usage:
// throw new ValidationError('Invalid category code', createErrorContext(
//     { categoryCode: 'INVALID' },
//     'RuleManager',
//     'validateCategory'
// ));
