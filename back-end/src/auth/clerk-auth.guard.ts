import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';


@Injectable()
export class ClerkAuthGuard {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    // Always allow access in development mode
    return true;
  }
}