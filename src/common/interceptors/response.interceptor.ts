import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { METADATA_KEYS } from '../constants';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const responseMessage =
      this.reflector.get<string>(
        METADATA_KEYS.RESPONSE_MESSAGE,
        context.getHandler(),
      ) || 'Request successful';

    return next.handle().pipe(
      map((data: JSONValue) => ({
        success: true,
        message: responseMessage,
        data,
      })),
    );
  }
}
