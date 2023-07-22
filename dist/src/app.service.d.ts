import { Reviews } from './reviews/reviews';
import { PageResponse } from 'types';
export declare class AppService extends Reviews {
    getReviews(url: string): Promise<PageResponse>;
    processPages(): Promise<Uint8Array>;
    pngToPdf(pngFilePath: any, pdfDoc: any): Promise<void>;
    createPDF(): Promise<any>;
}
