# Radio Rotation System Acceptance Criteria

## 1. Core Functionality

### 1.1 Rotation Validation
- **Given** a rotation name (e.g., "Hr A")
- **When** validating the rotation
- **Then** system should:
  - Report whether rotation is compliant
  - List all violations if any
  - Provide clear explanations for each violation
  - Suggest possible resolutions

### 1.2 Category Rules
- **Given** any rotation
- **When** checking category frequencies
- **Then** system should verify:
  - Exactly 2 CE, CM, and CL tracks
  - 1-2 G tracks (not 2 if also 2 M tracks)
  - 1-2 M tracks (not 2 if also 2 G tracks)
  - Either 2 SCo tracks OR 1 SCo and 1 SCh track
  - Maximum 1 SD track
  - Maximum 2 PB tracks

### 1.3 Pattern Compliance
- **Given** a rotation's music sets
- **When** validating patterns
- **Then** system should verify:
  - Pattern I usage rules in first two sets
  - Pattern I required in second set with G/SD in position 7
  - No consecutive patterns of same type
  - Third set follows required structure
  - Position 5 in third set contains SP, SR, SD, or SCo
  - Position 6 in third set contains PB

### 1.4 Commercial Break Rules
- **Given** a rotation's commercial breaks
- **When** validating breaks
- **Then** system should verify:
  - Breaks use valid patterns (631, 633, 613, 63, 61, 331)
  - Breaks differ in length
  - At least one 15-second spot in second/third position
  - Total break duration between 75-120 seconds

## 2. Rule Enforcement

### 2.1 Category Placement
- **Given** any rotation
- **When** checking category placement
- **Then** system should enforce:
  - No consecutive date-based categories
  - One different category between same category reuse
  - No date-based categories after jingles
  - Valid opening categories (CE, CM, CL, M)
  - Each set starts with category I

### 2.2 Set Structure
- **Given** a rotation's sets
- **When** validating structure
- **Then** system should verify:
  - Proper placement of TOH promo and station ID
  - Correct jingle placement per pattern
  - Valid category combinations within sets
  - Commercial break placement between sets

## 3. Analysis Capabilities

### 3.1 Violation Reporting
- **Given** a non-compliant rotation
- **When** analyzing violations
- **Then** system should:
  - List all violations in priority order
  - Explain each violation clearly
  - Reference specific rules being violated
  - Provide actionable resolution steps

### 3.2 Position Analysis
- **Given** a specific position in the rotation
- **When** analyzing available options
- **Then** system should:
  - List all categories valid for that position
  - Explain why other categories are invalid
  - Show which rules are affecting the position
  - Suggest alternative arrangements if needed

## 4. User Interaction

### 4.1 Error Messages
- **Given** any error condition
- **When** reporting to user
- **Then** system should provide:
  - Clear description of the problem
  - Specific location of the issue
  - Reference to relevant rules
  - Suggested corrective actions

### 4.2 Modification Guidance
- **Given** a request to fix violations
- **When** suggesting changes
- **Then** system should:
  - Provide specific, actionable steps
  - Explain impact of each change
  - Maintain other valid parts of rotation
  - Verify suggested changes create valid rotation

## 5. Performance Requirements

### 5.1 Response Time
- **Given** any rotation validation request
- **When** processing
- **Then** system should:
  - Complete basic validation in under 1 second
  - Complete full analysis in under 3 seconds
  - Provide progress indication for longer operations
  - Cache results when appropriate

### 5.2 Reliability
- **Given** continuous system operation
- **When** processing multiple requests
- **Then** system should:
  - Handle concurrent validation requests
  - Maintain consistent rule enforcement
  - Recover gracefully from errors
  - Preserve data integrity

## 6. Integration Requirements

### 6.1 Database Integration
- **Given** existing rotation data
- **When** accessing rotations
- **Then** system should:
  - Use existing database structure
  - Honor existing relationships
  - Maintain data consistency
  - Support rollback of changes

### 6.2 User Interface Integration
- **Given** command-line interface
- **When** executing operations
- **Then** system should:
  - Provide clear progress indication
  - Format output for readability
  - Support --go flag for modifications
  - Maintain audit trail of changes
