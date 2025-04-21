// src/appeals/appeals.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Appeal, AppealStatus } from './schemas/appeal.schema';
import { CreateAppealDto } from './dto/create-appeal.dto';
import { UpdateAppealDto } from './dto/update-appeal.dto';
import { AppealQueryDto } from './dto/appeal-query.dto';

@Injectable()
export class AppealsService {
  constructor(
    @InjectModel(Appeal.name) private readonly appealModel: Model<Appeal>,
  ) {}

  async create(createAppealDto: CreateAppealDto & { appealedBy: string }): Promise<Appeal> {
    const createdAppeal = new this.appealModel({
      ...createAppealDto,
      status: AppealStatus.PENDING,
    });
    
    return createdAppeal.save();
  }

  async findAll(query: AppealQueryDto): Promise<{ appeals: Appeal[]; total: number; page: number; limit: number }> {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = query;
    
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter: any = {};
    
    if (status) {
      filter.status = status;
    }
    
    // Calculate total
    const total = await this.appealModel.countDocuments(filter);
    
    // Fetch results with pagination and sorting
    const appeals = await this.appealModel.find(filter)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .populate('ban')
      .populate('appealedBy', 'username')
      .populate('reviewedBy', 'username')
      .exec();
    
    return {
      appeals,
      total,
      page: +page,
      limit: +limit,
    };
  }

  async findOne(id: string): Promise<Appeal> {
    const appeal = await this.appealModel.findById(id)
      .populate('ban')
      .populate('appealedBy', 'username')
      .populate('reviewedBy', 'username')
      .exec();
      
    if (!appeal) {
      throw new NotFoundException(`Appeal with ID ${id} not found`);
    }
    
    return appeal;
  }

  async update(id: string, updateAppealDto: UpdateAppealDto): Promise<Appeal> {
    const appeal = await this.appealModel.findByIdAndUpdate(id, updateAppealDto, { new: true }).exec();
    
    if (!appeal) {
      throw new NotFoundException(`Appeal with ID ${id} not found`);
    }
    
    return appeal;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const result = await this.appealModel.deleteOne({ _id: id }).exec();
    
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Appeal with ID ${id} not found`);
    }
    
    return { deleted: true };
  }
}