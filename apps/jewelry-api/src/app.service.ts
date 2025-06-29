import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
	getHello(): string {
		return 'Welcome to Jewelry Rest API Server!';
	}
}
