import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserRequest } from './dto/create-user.request';
import { User } from './schema/user.schema';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() request: CreateUserRequest) {
    await this.usersService.createUser(request);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUsers() {
    return this.usersService.getUsers();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@CurrentUser() user: User) {
    return this.usersService.getUser(user._id);
  }
}
