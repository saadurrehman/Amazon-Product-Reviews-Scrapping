import { Body, Controller, Post } from '@nestjs/common';
import { PageResponse } from 'types';
import { AppService } from './app.service';
type BodyType = {
  url: string;
};

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/views')
  async getAmazonPageReviews(@Body() body: BodyType): Promise<PageResponse> {
    return await this.appService.getReviews(body.url);
  }
}
