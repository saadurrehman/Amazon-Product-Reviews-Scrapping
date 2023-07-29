import { Reviews } from './reviews/reviews';
export declare class AppService extends Reviews {
    getReviews(url: string): Promise<string>;
    processPages(): Promise<string>;
    pngToPdf(pngFilePath: any, pdfDoc: any): Promise<void>;
    createPDF(): Promise<any>;
}
