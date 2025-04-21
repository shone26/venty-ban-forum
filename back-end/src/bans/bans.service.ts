/* eslint-disable prettier/prettier */
// src/bans/bans.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBanDto } from './dto/create-ban.dto';
import { UpdateBanDto } from './dto/update-ban.dto';
import { BanQueryDto } from './dto/ban-query.dto';
import { Ban, BanStatus } from './schemas/ban.schema';

@Injectable()
export class BansService {
  constructor(
    @InjectModel(Ban.name) private readonly banModel: Model<Ban>,
  ) {}

  async create(createBanDto: CreateBanDto & { bannedBy: string }): Promise<Ban> {
    const createdBan = new this.banModel(createBanDto);
    
    // If it's a temporary ban, calculate the expiration date
    if (createBanDto.durationType === 'temporary' && createBanDto.durationDays) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + createBanDto.durationDays);
      createdBan.expiresAt = expiresAt;
    }
    
    return createdBan.save();
  }

  async findAll(query: BanQueryDto): Promise<{ bans: Ban[]; total: number; page: number; limit: number }> {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      search, 
      steamId,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = query;
    
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter: any = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (steamId) {
      filter.steamId = steamId;
    }
    
    if (search) {
      filter.$text = { $search: search };
    }
    
    // Calculate total
    const total = await this.banModel.countDocuments(filter);
    
    // Fetch results with pagination and sorting
    const bans = await this.banModel.find(filter)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .populate('bannedBy', 'username')
      .exec();
    
    return {
      bans,
      total,
      page: +page,
      limit: +limit,
    };
  }

  async findOne(id: string): Promise<Ban> {
    const ban = await this.banModel.findById(id)
      .populate('bannedBy', 'username')
      .populate('appeals')
      .exec();
      
    if (!ban) {
      throw new NotFoundException(`Ban with ID ${id} not found`);
    }
    
    return ban;
  }

  async update(id: string, updateBanDto: UpdateBanDto): Promise<Ban> {
    const ban = await this.banModel.findByIdAndUpdate(id, updateBanDto, { new: true }).exec();
    
    if (!ban) {
      throw new NotFoundException(`Ban with ID ${id} not found`);
    }
    
    return ban;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const result = await this.banModel.deleteOne({ _id: id }).exec();
    
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Ban with ID ${id} not found`);
    }
    
    return { deleted: true };
  }

  async checkActiveBan(steamId: string): Promise<Ban | null> {
    // Check if there's an active ban for this Steam ID
    const ban = await this.banModel.findOne({
      steamId,
      status: BanStatus.ACTIVE,
      $or: [
        { expiresAt: { $gt: new Date() } },
        { durationType: 'permanent' }
      ]
    }).exec();
    
    return ban;
  }
}