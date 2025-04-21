// src/users/users.controller.ts
import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
  } from '@nestjs/common';
  import { UsersService } from './users.service';
  import { CreateUserDto } from './dto/create-user.dto';
  import { UpdateUserDto } from './dto/update-user.dto';
  import { AuthGuard } from '../auth/guards/auth.guard';
  import { RolesGuard } from '../auth/guards/roles.guard';
  import { Roles } from '../common/decorators/roles.decorator';
  
  @Controller('users')
  @UseGuards(AuthGuard)
  export class UsersController {
    constructor(private readonly usersService: UsersService) {}
  
    @Post()
    @UseGuards(RolesGuard)
    @Roles('admin')
    create(@Body() createUserDto: CreateUserDto) {
      return this.usersService.create(createUserDto);
    }
  
    @Get()
    @UseGuards(RolesGuard)
    @Roles('admin')
    findAll() {
      return this.usersService.findAll();
    }
  
    @Get(':id')
    @UseGuards(RolesGuard)
    @Roles('admin')
    findOne(@Param('id') id: string) {
      return this.usersService.findById(id);
    }
  
    @Patch(':id')
    @UseGuards(RolesGuard)
    @Roles('admin')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
      return this.usersService.update(id, updateUserDto);
    }
  
    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles('admin')
    remove(@Param('id') id: string) {
      return this.usersService.remove(id);
    }
  }
  