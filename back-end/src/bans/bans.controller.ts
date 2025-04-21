/* eslint-disable prettier/prettier */
// src/bans/bans.controller.ts
import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query
  } from '@nestjs/common';
  import { BansService } from './bans.service';
  import { CreateBanDto } from './dto/create-ban.dto';
  import { UpdateBanDto } from './dto/update-ban.dto';
import { BanQueryDto } from './dto/ban-query.dto';

  
  @Controller('bans')
  export class BansController {
    constructor(private readonly bansService: BansService) {}
  
    @Post()
    create(@Body() createBanDto: CreateBanDto) {
      // Add a mock user ID since we removed authentication
      return this.bansService.create({
        ...createBanDto,
        bannedBy: '68067a8d671f80ec7d6ec9e0', // Mock user ID
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
    update(@Param('id') id: string, @Body() updateBanDto: UpdateBanDto) {
      return this.bansService.update(id, updateBanDto);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.bansService.remove(id);
    }
  
    @Get('check/:steamId')
    checkBan(@Param('steamId') steamId: string) {
      return this.bansService.checkActiveBan(steamId);
    }
  }