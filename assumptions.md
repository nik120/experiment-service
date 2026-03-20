# Assumptions

## user_id
- Must be a positive number — strings and negative numbers are rejected
- Treated as the sole input for variant assignment

## Assignment
- SHA-256 hash of user_id determines the variant
- Even hash number → variant A
- Odd hash number → variant B
- This guarantees the same user always gets the same variant across
  requests and container restarts

## API
- No authentication on endpoints
- Assumed to sit behind an API gateway in a real setup
- Only one endpoint needed: GET /experiment?user_id=<id>

## Scope
- This is a partial implementation
- No analytics or event tracking
- No admin UI
- No statistical significance calculation
- No gradual rollout or scheduling