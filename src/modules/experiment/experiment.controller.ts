import { Controller, Get, Query, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ExperimentService } from './experiment.service';

/**
 * Handles incoming HTTP requests for the experiment endpoint.
 * Responsible only for request validation and response formatting.
 * All assignment logic lives in ExperimentService.
 */
@Controller('experiment')
export class ExperimentController {

  constructor(private readonly experimentService: ExperimentService) {}
  
  /**
   * GET /experiment?user_id=<id>
   * Returns which variant the given user is assigned to.
   * The same user_id will always return the same variant.
   */
  @Get()
  async fetchUserVariant(@Query('user_id') userId: string): Promise<any> {

    // required check
    if (!userId) {
      throw new BadRequestException('user_id is required');
    }

    // empty check
    if (userId.trim() === '') {
      throw new BadRequestException('user_id cannot be empty');
    }

    // number validation
    const numericUserId = Number(userId);

    if (isNaN(numericUserId)) {
      throw new BadRequestException('user_id must be a valid number');
    }

    if (numericUserId < 0) {
      throw new BadRequestException('user_id must be a positive number');
    }

    try{
          const variant = this.experimentService.getVariant(userId);
          console.log(`User ${userId} -> Variant ${variant}`);
          return {
            message: "Success",
            user_id: numericUserId,
            variant: variant
          };
    }catch(error){
      throw new InternalServerErrorException('An error occurred while processing the request');
    }
  }
}