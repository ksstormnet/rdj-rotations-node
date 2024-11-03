# Radio Rotation Patterns

## Music Set Patterns

### Available Patterns
1. Pattern I
   ```
   [I, Music, Jingle, Music, Music, Jingle, Music]
   ```

2. Pattern II
   ```
   [I, Music, Jingle, Music, Music, Music, Music]
   ```

3. Pattern III
   ```
   [I, Music, Music, Jingle, Music, Music, Music]
   ```

4. Third Set Pattern (Fixed)
   ```
   [I, Music, Jingle, Music, Music, PB]
   ```

### Pattern Usage Rules

#### Pattern I Rules
- Can be used in either first or second set, but not both
- **Required** in second set if:
  - Category G (Gold) is in seventh position
  - Category SD (Disco) is in seventh position
- **Allowed** in first set if seventh position contains:
  - Category PB (Power Ballad)
  - Category M (Modern)

#### Pattern II & III Rules
- Can be used in either first or second set
- Same pattern cannot be used for both sets
- No special category placement requirements

#### Third Set Rules
- Fixed pattern, always used for third set
- Position 5 must contain one of:
  - SP (Pop)
  - SR (Rock)
  - SD (Disco)
  - SCo (Country)
- Position 6 must be PB (Power Ballad)
- Rules about jingles can be relaxed in this set due to timing considerations

## Commercial Break Patterns

### Valid Patterns
| Pattern | Sequence | Total Duration |
|---------|----------|----------------|
| 631 | 60s, 30s, 15s | 105s |
| 633 | 60s, 30s, 30s | 120s |
| 613 | 60s, 15s, 30s | 105s |
| 63  | 60s, 30s      | 90s  |
| 61  | 60s, 15s      | 75s  |
| 331 | 30s, 30s, 15s | 75s  |

### Commercial Break Rules
1. Duration Requirements
   - Minimum: 75 seconds
   - Maximum: 120 seconds
   - Breaks must differ in length

2. 15-Second Spot Rule
   - At least one 15-second spot required per hour
   - Must appear in second or third position
   - Can be in either break

## Pattern Visualization

```
Hour Structure:
[Opening Track (CE/CM/CL/M)]
[TOH Promo]
[Station ID]
[First Set  (Pattern I/II/III)]
[Commercial Break 1]
[Second Set (Pattern I/II/III)]
[Commercial Break 2]
[Third Set  (Fixed Pattern)]
```

## Implementation Considerations
1. Pattern Validation
   - Check pattern selection rules
   - Validate category placement
   - Ensure pattern combinations are valid

2. Commercial Break Validation
   - Verify break lengths
   - Check 15-second spot placement
   - Validate break combinations

3. Pattern Dependencies
   - Category placement affects pattern selection
   - Pattern selection affects available categories
   - Commercial patterns must coordinate between breaks

