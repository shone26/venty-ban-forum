// src/bans/bans.controller.ts
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
  import { BansService } from './bans.service';
  import { CreateBanDto } from './dto/create-ban.dto';
  import { UpdateBanDto } from './dto/update-ban.dto';
  import { BanQueryDto } from './dto/ban-query.dto';
  import { AuthGuard } from '../auth/guards/auth.guard';
  import { RolesGuard } from '../auth/guards/roles.guard';
  import { Roles } from '../common/decorators/roles.decorator';
  
  @Controller('bans')
  @UseGuards(AuthGuard)
  export class BansController {
    constructor(private readonly bansService: BansService) {}
  
    @Post()
    @UseGuards(RolesGuard)
    @Roles('admin', 'moderator')
    create(@Body() createBanDto: CreateBanDto, @Req() req) {
      // Add the user ID from the JWT token
      return this.bansService.create({
        ...createBanDto,
        bannedBy: req.user.userId,
      });
    }
  
    @Get()
    findAll(@Query() query: BanQueryDto) {
      return this.bansService.findAll(query);
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.bansService.findOne(id);
    }
  
    @Patch(':id')
    @UseGuards(RolesGuard)
    @Roles('admin', 'moderator')
    update(@Param('id') id: string, @Body() updateBanDto: UpdateBanDto) {
      return this.bansService.update(id, updateBanDto);
    }
  
    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles('admin')
    remove(@Param('id') id: string) {
      return this.bansService.remove(id);
    }
  
    @Get('check/:steamId')
    checkBan(@Param('steamId') steamId: string) {
      return this.bansService.checkActiveBan(steamId);
    }
  }