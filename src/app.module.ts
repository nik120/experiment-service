import { Module } from '@nestjs/common';
import { ExperimentModule } from './modules/experiment/experiment.module';
@Module({
  imports: [ExperimentModule],
})
export class AppModule {}
