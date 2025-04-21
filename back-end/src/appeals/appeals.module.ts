// src/appeals/appeals.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Appeal, AppealSchema } from './schemas/appeal.schema';
import { AppealsService } from './appeals.service';
import { AppealsController } from './appeals.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Appeal.name, schema: AppealSchema },
    ]),
  ],
  providers: [AppealsService],
  controllers: [AppealsController],
  exports: [AppealsService],
})
export class AppealsModule {}