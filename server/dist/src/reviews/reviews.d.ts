import { Browser, Page } from 'puppeteer';
export declare class Reviews {
    browser: Browser;
    currentPage: Page;
    productNames: any[];
    getUrlVisitPage(url: string): Promise<void>;
    getProductRating(): Promise<string>;
    getIsReviewExistOnPage(): Promise<Element>;
    getNextButton(): Promise<boolean>;
    isNextButtonDisabled: () => Promise<boolean>;
    getReviewDetailsOfReviewer(): Promise<any[]>;
    takeScreenshot(): Promise<void>;
}
