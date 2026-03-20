# A/B Experimentation System

A backend service that deterministically assigns users to experiment variants and serves the configuration to frontend clients.

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

## How Assignment Works

- user_id is passed to SHA-256 hash function
- Hash is converted to a number
- Even number → variant A, Odd number → variant B
- Same user_id always returns same variant across requests and container restarts
- No database needed — the hash is the assignment

## Architecture

- **NestJS + TypeScript** — predictable structure, built-in dependency injection
- **Stateless assignment** — no storage required, hash function guarantees consistency
- **Single responsibility** — service handles logic, controller handles HTTP

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