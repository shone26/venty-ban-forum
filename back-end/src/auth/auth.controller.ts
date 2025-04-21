/* eslint-disable prettier/prettier */


import { Controller, Get } from '@nestjs/common';
 // Corrected import path

import { clerkClient } from '@clerk/clerk-sdk-node';
import { Public } from '../decorators/public.decorator';



@Controller('auth')
export class AuthController {
    
    @Public()
    @Get('users')
    getHello(): Promise<any> {
        return clerkClient.users.getUserList();
    }

}