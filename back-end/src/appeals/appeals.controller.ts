/* eslint-disable prettier/prettier */
// src/appeals/appeals.controller.ts
import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
  } from '@nestjs/common';
  import { AppealsService } from './appeals.service';
import { CreateAppealDto } from './dto/create-appeal.dto';
import { AppealQueryDto } from './dto/appeal-query.dto';
import { UpdateAppealDto } from './dto/update-appeal.dto';

  
  @Controller('appeals')
  export class AppealsController {
    constructor(private readonly appealsService: AppealsService) {}
  
    @Post()
    create(@Body() createAppealDto: CreateAppealDto) {
      // Add a mock user ID since we removed authentication
      return this.appealsService.create({
        ...createAppealDto,
        appealedBy: 'mock-user-id', // Mock user ID
      });
    }
  
    @Get()
    findAll(@Query() query: AppealQueryDto) {
      return this.appealsService.findAll(query);
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.appealsService.findOne(id);
    }
  
    @Patch(':id')
    update(
      @Param('id') id: string, 
      @Body() updateAppealDto: UpdateAppealDto
    ) {
      // Add reviewer information if updating the status
      if (updateAppealDto.status && ['approved', 'rejected'].includes(updateAppealDto.status)) {
        updateAppealDto.reviewedBy = 'mock-admin-id'; // Mock admin ID
      }
      
      return this.appealsService.update(id, updateAppealDto);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.appealsService.remove(id);
    }
  }