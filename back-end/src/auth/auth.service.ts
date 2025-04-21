/* eslint-disable prettier/prettier */
import { clerkClient } from '@clerk/clerk-sdk-node';
import { Injectable } from '@nestjs/common';
import { Public } from '../decorators/public.decorator';

@Injectable()
@Public()
export class AuthService {
    async getAllUsers() {
        return clerkClient.users.getUserList();
    }
}