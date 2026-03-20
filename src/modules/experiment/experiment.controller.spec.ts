import { Test, TestingModule } from '@nestjs/testing';
import { ExperimentController } from './experiment.controller';
import { ExperimentService } from './experiment.service';
import { BadRequestException } from '@nestjs/common';

describe('ExperimentController', () => {
  let controller: ExperimentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExperimentController],
      providers: [ExperimentService],
    }).compile();

    controller = module.get<ExperimentController>(ExperimentController);
  });

  // happy path
  it('returns success response for valid user_id', async () => {
    const result = await controller.fetchUserVariant('42');
    expect(result.message).toBe('Success');
    expect(result.user_id).toBe(42);
    expect(['A', 'B']).toContain(result.variant);
  });

  // same user always gets same variant
  it('returns same variant for same user_id on repeated calls', async () => {
    const first = await controller.fetchUserVariant('42');
    for (let i = 0; i < 10; i++) {
      const result = await controller.fetchUserVariant('42');
      expect(result.variant).toBe(first.variant);
    }
  });

  // empty user_id
  it('throws BadRequestException when user_id is empty', async () => {
    await expect(controller.fetchUserVariant('   ')).rejects.toThrow(
      BadRequestException
    );
  });

  // non-numeric user_id
  it('throws BadRequestException when user_id is not a number', async () => {
    await expect(controller.fetchUserVariant('abc')).rejects.toThrow(
      BadRequestException
    );
  });

  // negative user_id
  it('throws BadRequestException when user_id is negative', async () => {
    await expect(controller.fetchUserVariant('-1')).rejects.toThrow(
      BadRequestException
    );
  });

});