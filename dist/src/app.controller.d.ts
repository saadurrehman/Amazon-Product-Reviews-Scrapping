import { PageResponse } from 'types';
import { AppService } from './app.service';
type BodyType = {
    url: string;
};
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getAmazonPageReviews(body: BodyType): Promise<PageResponse>;
}
export {};
