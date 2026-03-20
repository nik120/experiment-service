import { Test, TestingModule } from '@nestjs/testing';
import { ExperimentService } from './experiment.service';

describe('ExperimentService', () => {
  let service: ExperimentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExperimentService],
    }).compile();

    service = module.get<ExperimentService>(ExperimentService);
  });

  // most important test — same user must always get same variant
  it('returns the same variant for the same user every time', () => {
    const first = service.getVariant('42');
    for (let i = 0; i < 100; i++) {
      expect(service.getVariant('42')).toBe(first);
    }
  });

  // variant must be either A or B, nothing else
  it('always returns either A or B', () => {
    const users = ['1', '42', '99', '100', '999'];
    users.forEach(userId => {
      const variant = service.getVariant(userId);
      expect(['A', 'B']).toContain(variant);
    });
  });

  // different users should not all get the same variant
  it('assigns different variants to different users', () => {
    const results = new Set<string>();
    for (let i = 0; i < 100; i++) {
      results.add(service.getVariant(String(i)));
    }
    // if all 100 users got the same variant, distribution is broken
    expect(results.size).toBeGreaterThan(1);
  });

  // roughly 50/50 split over large sample
  it('distributes users roughly 50/50 between variants', () => {
    const counts = { A: 0, B: 0 };
    for (let i = 0; i < 1000; i++) {
      const variant = service.getVariant(String(i));
      counts[variant]++;
    }
    // allow ±10% tolerance
    expect(counts.A).toBeGreaterThan(400);
    expect(counts.A).toBeLessThan(600);
    expect(counts.B).toBeGreaterThan(400);
    expect(counts.B).toBeLessThan(600);
  });

});