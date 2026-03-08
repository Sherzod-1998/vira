import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	private readonly logger: Logger = new Logger();

	public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const recordTime = Date.now();
		const requestType = context.getType<GqlContextType>();
		if (requestType === 'graphql') {
			const gqlContext = GqlExecutionContext.create(context);
			const body = gqlContext.getContext().req?.body ?? {};
			const operationName = body.operationName ?? 'anonymous';
			this.logger.log(operationName, 'REQUEST');

			return next.handle().pipe(
				tap(() => {
					const responseTime = Date.now() - recordTime;
					this.logger.log(`${operationName} - ${responseTime}ms`, 'RESPONSE');
				}),
			);
		}

		return next.handle();
	}
}
