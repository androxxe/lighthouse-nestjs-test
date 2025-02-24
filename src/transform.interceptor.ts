import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

export interface Response<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class TransformationInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({
        message: data?.message || 'Success',
        statusCode: context.switchToHttp().getResponse().statusCode,
        data: data?.data ? data.data : data?.message && !data?.data ? null : data,
        meta: data?.meta ?? undefined,
      }))
    );
  }
}
