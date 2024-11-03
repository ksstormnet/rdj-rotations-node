# Radio DJ Rotation Manager

## Table of Contents
- [Overview](#overview)
- [Project Purpose](#project-purpose)
- [Documentation](#documentation)
- [Core Components](#core-components)
- [Key Rules](#key-rules)
  - [Category Types](#category-types)
  - [Pattern Rules](#pattern-rules)
  - [Key Constraints](#key-constraints)
- [Usage](#usage)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Validation](#validation)
- [Development](#development)
  - [Testing](#testing)
  - [Key Files](#key-files)
  - [Implementation Sequence](#implementation-sequence)
- [Database Schema](#database-schema)
- [Error Handling](#error-handling)
- [Future Development](#future-development)
- [Contributing](#contributing)
- [License](#license)

## Overview
The Radio DJ Rotation Manager validates and generates radio rotation schedules according to complex formatting rules. A rotation defines the sequence of songs, commercials, and other elements for one hour of programming.

[Return to Top](#table-of-contents)

## Project Purpose
- Validate existing rotations for rule compliance
- Identify specific rule violations
- Provide clear explanations for violations
- Suggest resolutions for non-compliant rotations
- (Future) Generate valid rotations automatically

[Return to Top](#table-of-contents)

## Documentation
- [Acceptance Criteria](./docs/AcceptanceCriteria.md) - Detailed system requirements
- [Test Coverage Matrix](./docs/TestCoverageMatrix.md) - Test coverage mapping
- [Patterns Documentation](./docs/Patterns.md) - Detailed pattern rules and structures
- [License](./LICENSE.md) - MIT License
- Implementation Plans:
  - [Implementation Sequence](./docs/ImplementationSequence.md)
  - [Rule Manager](./docs/1-rule-manager-implementation.json)
  - [Pattern Structure](./docs/2-pattern-structure-implementation.json)
  - [Validation Rules](./docs/3-validation-rules-implementation.json)
  - [Schedule Analysis](./docs/4-schedule-analysis-implementation.json)
  - [Rotation Builder](./docs/5-rotation-builder-implementation.json)
  - [Implementation Summary](./docs/implementation-summary.json)

[Return to Top](#table-of-contents)

## Core Components

### RuleManager
- Loads and validates rotation rules
- Provides type-safe rule access
- Establishes baseline validation

### PatternManager
- Defines valid music set patterns
- Manages commercial break patterns
- Validates pattern combinations

### ValidationManager
- Enforces category frequency rules
- Validates category placement
- Ensures pattern compliance

### ScheduleAnalyzer
- Analyzes rule violations
- Identifies constraint conflicts
- Suggests resolution strategies

### RotationBuilder
- Implements rotation construction
- Handles constraint satisfaction
- Modifies existing rotations

[Return to Top](#table-of-contents)

## Key Rules

### Category Types
```typescript
// Core (Date-Based) Categories
CE - Core Early (1978-1983)   // exactly 2 per hour
CM - Core Mid (1984-1988)     // exactly 2 per hour
CL - Core Late (1989-1993)    // exactly 2 per hour
M  - Modern (Post-1994)       // 1-2 per hour
G  - Gold (Pre-1978)          // 1-2 per hour

// Sound-Based Categories
SCo - Country                 // 2, or 1 with 1 SCh
SCh - Christian              // 1 with 1 SCo
SP  - Pop                    // variable
SR  - Rock                   // variable
SD  - Disco                  // max 1 per hour
PB  - Power Ballad           // max 2 per hour

// Utility Categories
I     - Image       // starts each set
TOH   - Top of Hour // fixed position
ID    - Station ID  // fixed position
B/tM  - Jingles    // pattern-dependent
```

### Pattern Rules
See the [Patterns Documentation](./docs/Patterns.md) for detailed information about:
- Music Set Patterns (I, II, III, and Third Set)
- Pattern Usage Rules and Constraints
- Commercial Break Patterns and Rules

Overview:
1. Music Sets
   - Three patterns available for first two sets
   - Fixed pattern for third set
   - Specific rules govern pattern combinations and usage

2. Commercial Break Patterns
   ```
   631 - [60s, 30s, 15s] = 105s
   633 - [60s, 30s, 30s] = 120s
   613 - [60s, 15s, 30s] = 105s
   63  - [60s, 30s]      = 90s
   61  - [60s, 15s]      = 75s
   331 - [30s, 30s, 15s] = 75s
   ```

[Return to Top](#table-of-contents)

### Key Constraints
1. Category Placement
   - No consecutive date-based categories
   - One different category between repeats
   - No date-based after jingles
   - Third set position 5: SP, SR, SD, or SCo only
   - Third set must end with PB

2. Commercial Breaks
   - Different lengths for each break
   - At least one 15-second spot in position 2 or 3
   - Total duration: 75-120 seconds

[Return to Top](#table-of-contents)

## Usage

### Installation
```bash
npm install
npm run build
```

### Configuration
1. Create `.env` file with database credentials
2. Verify `schedule-rules.json` contains current rules

### Validation
```bash
# Check rotation compliance
npm run validate "Hr A"

# Detailed analysis with suggestions
npm run analyze "Hr A"

# Modify rotation (requires --go flag)
npm run fix "Hr A" --go
```

[Return to Top](#table-of-contents)

## Development

### Testing
```bash
# Run all tests
npm test

# Run specific test suite
npm test ValidationManager
```

### Key Files
- `schedule-rules.json` - Rule configuration
- `src/models/rotationCodes.ts` - Category definitions
- `src/business/` - Core business logic
- `tests/` - Test suites

### Implementation Sequence
1. RuleManager implementation
2. PatternManager implementation
3. ValidationManager implementation
4. ScheduleAnalyzer implementation
5. RotationBuilder implementation

For detailed implementation plans, see the [documentation section](#documentation).

[Return to Top](#table-of-contents)

## Database Schema
The system uses MariaDB with the following key tables:
- `category` - Category definitions
- `subcategory` - Subcategory mappings
- `rotations` - Rotation definitions
- `rotations_list` - Rotation content

[Return to Top](#table-of-contents)

## Error Handling
- Critical errors fail fast
- Non-critical violations collected for reporting
- Clear error messages with resolution guidance
- Full logging of decisions and validations

[Return to Top](#table-of-contents)

## Future Development
1. Automatic rotation generation
2. Pattern optimization
3. Rule conflict resolution
4. Web interface

[Return to Top](#table-of-contents)

## Contributing
1. Fork repository
2. Create feature branch
3. Submit pull request with tests
4. Ensure documentation is updated

See [Test Coverage Matrix](./docs/TestCoverageMatrix.md) for testing requirements.

[Return to Top](#table-of-contents)

## License
This project is licensed under the MIT License - see the [LICENSE.md](./LICENSE.md) file for details.

[Return to Top](#table-of-contents)
