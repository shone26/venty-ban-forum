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
    UseGuards,
    Req,
  } from '@nestjs/common';
  import { AppealsService } from './appeals.service';
  import { CreateAppealDto } from './dto/create-appeal.dto';
  import { UpdateAppealDto } from './dto/update-appeal.dto';
  import { AppealQueryDto } from './dto/appeal-query.dto';
  import { AuthGuard } from '../auth/guards/auth.guard';
  import { RolesGuard } from '../auth/guards/roles.guard';
  import { Roles } from '../common/decorators/roles.decorator';
  
  @Controller('appeals')
  @UseGuards(AuthGuard)
  export class AppealsController {
    constructor(private readonly appealsService: AppealsService) {}
  
    @Post()
    create(@Body() createAppealDto: CreateAppealDto, @Req() req) {
      // Add the user ID from the JWT token
      return this.appealsService.create({
        ...createAppealDto,
        appealedBy: req.user.userId,
      });
    }
  
    @Get()
    @UseGuards(RolesGuard)
    @Roles('admin', 'moderator')
    findAll(@Query() query: AppealQueryDto) {
      return this.appealsService.findAll(query);
    }
  
    @Get(':id')
    findOne(@Param('id') id: string, @Req() req) {
      // In a real app, you might want to check if the user is allowed to see this appeal
      return this.appealsService.findOne(id);
    }
  
    @Patch(':id')
    @UseGuards(RolesGuard)
    @Roles('admin', 'moderator')
    update(
      @Param('id') id: string, 
      @Body() updateAppealDto: UpdateAppealDto,
      @Req() req
    ) {
      // Add reviewer information if updating the status
      if (updateAppealDto.status && ['approved', 'rejected'].includes(updateAppealDto.status)) {
        updateAppealDto.reviewedBy = req.user.userId;
      }
      
      return this.appealsService.update(id, updateAppealDto);
    }
  
    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles('admin')
    remove(@Param('id') id: string) {
      return this.appealsService.remove(id);
    }
  }