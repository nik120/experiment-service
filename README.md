# A/B Experimentation System

A backend service that deterministically assigns users to experiment variants
and serves the configuration to frontend clients.

## How to Build
```bash
docker compose build
```

## How to Run
```bash
docker compose up
```

## How to Trigger Core Functionality
```bash
curl "localhost:8080/experiment?user_id=42"
```

## Example Response
```json
{
  "message": "Success",
  "user_id": 42,
  "variant": "A"
}
```

## Verify Determinism

Run the same user multiple times — variant never changes:
```bash
curl "localhost:8080/experiment?user_id=42"
curl "localhost:8080/experiment?user_id=42"
curl "localhost:8080/experiment?user_id=42"
```

Restart the container and check again — still same variant:
```bash
docker compose restart
curl "localhost:8080/experiment?user_id=42"
```

## How Assignment Works

- user_id is passed to SHA-256 hash function
- Hash is converted to a number
- Even number → variant A, Odd number → variant B
- Same user_id always returns same variant across requests and container restarts
- No database needed — the hash is the assignment

## Why Stateless Assignment?

The biggest risk in an A/B system is inconsistency — a user seeing
variant A on one request and variant B on the next.

Most naive implementations solve this by storing assignments in a database.
That works but introduces a new problem — the database becomes a single
point of failure. If it goes down, no one gets assigned.

This service avoids that entirely. The hash function IS the storage.
No database, no cache, no state. The same user_id will always produce
the same variant on any machine, at any time, after any number of restarts.

## Architecture

- **NestJS + TypeScript** — predictable structure, built-in dependency injection
- **Stateless assignment** — no storage required, hash function guarantees consistency
- **Single responsibility** — service handles logic, controller handles HTTP

## Why These Architecture Choices

**Why NestJS?**
Opinionated structure keeps the code organized and predictable.
Dependency injection makes the service easy to unit test in isolation.

**Why SHA-256 for assignment?**
It is deterministic — same input always produces same output.
No external dependency needed, available in Node's built-in crypto module.
Uniform distribution ensures users are split evenly between variants.

**Why no database?**
Storing assignments in a database would introduce an extra failure point.
The hash function itself is the storage — if the server restarts, the same
user_id will always hash to the same variant without needing to look anything up.

## Trade-offs Considered

| Option | What I chose | Why |
|--------|-------------|-----|
| Hash function | SHA-256 | Built into Node, no extra dependency |
| Framework | NestJS | Structure and testability over raw Express |
| Variant logic | Even/odd | Simple, explainable, easy to verify |
| Config storage | No config file | Keeps it simple for two variants |

## Error Cases

Missing user_id:
```bash
curl "localhost:8080/experiment"
# {"statusCode":400,"message":"user_id is required"}
```

Invalid user_id:
```bash
curl "localhost:8080/experiment?user_id=abc"
# {"statusCode":400,"message":"user_id must be a valid number"}
```

Negative user_id:
```bash
curl "localhost:8080/experiment?user_id=-1"
# {"statusCode":400,"message":"user_id must be a positive number"}
```

## Folder Structure
```
src/
  modules/
    experiment/
      experiment.service.ts     — hash logic and variant assignment
      experiment.controller.ts  — GET /experiment endpoint
      experiment.module.ts      — NestJS wiring
```

## Constraints

- user_id must be a positive number
- Runs on port 8080
- No external services or cloud dependencies
- No Kubernetes