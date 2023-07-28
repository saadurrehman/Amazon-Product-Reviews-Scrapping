"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const constant_1 = require("./constant");
const reviews_1 = require("./reviews/reviews");
const pdf_lib_1 = require("pdf-lib");
const fs = require("fs");
let AppService = exports.AppService = class AppService extends reviews_1.Reviews {
    async getReviews(url) {
        await this.getUrlVisitPage(url);
        await this.currentPage.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
        });
        const productRating = await this.getProductRating();
        await this.currentPage.waitForTimeout(3000);
        const isAllReviewExist = await this.getIsReviewExistOnPage();
        if (isAllReviewExist) {
            try {
                await this.currentPage.click(constant_1.AMAZON_REVIEW_PAGE.ALL_REVIEWS_BUTTON);
                await this.currentPage.waitForSelector(constant_1.AMAZON_REVIEW_PAGE.ALL_REVIEW_PAGE);
                await this.currentPage.waitForTimeout(3000);
                await this.takeScreenshot();
                await this.getReviewDetailsOfReviewer();
                const buffer = await this.processPages();
                console.log('got data');
                return buffer;
            }
            catch (err) {
                console.log(err);
                console.log('productNames', this.productNames);
            }
        }
        else {
            console.log('not exist');
        }
        return null;
    }
    async processPages() {
        console.log('process pdf');
        return new Promise((resolve) => {
            (async () => {
                do {
                    try {
                        console.log('step1');
                        await this.currentPage.waitForTimeout(5000);
                        await this.currentPage.waitForSelector(constant_1.AMAZON_REVIEW_PAGE.NEXT_PAGE);
                        console.log('step click');
                        await this.currentPage.click(constant_1.AMAZON_REVIEW_PAGE.NEXT_PAGE);
                        const responseMatchesPattern = (response) => constant_1.REGEX_API_PATTERN.test(response.url());
                        console.log('step response');
                        await this.currentPage.waitForResponse(responseMatchesPattern, {
                            timeout: 60 * 1000,
                        });
                        await this.currentPage.waitForTimeout(3000);
                        await this.takeScreenshot();
                        const names = await this.getReviewDetailsOfReviewer();
                        console.log('step response names');
                        this.productNames = [...this.productNames, ...names];
                    }
                    catch (err) {
                        console.log('err', err);
                        throw err;
                    }
                    const isBtnNtDisabled = await this.isNextButtonDisabled();
                    console.log('isBtnDisabled', isBtnNtDisabled);
                    if (isBtnNtDisabled)
                        break;
                } while (true);
                console.log('merging pdf');
                const data = await this.createPDF();
                console.log('seing data back');
                resolve(data);
            })();
        });
    }
    async pngToPdf(pngFilePath, pdfDoc) {
        const pngImage = await pdfDoc.embedPng(fs.readFileSync(pngFilePath));
        const pngDims = pngImage.scale(1);
        const page = pdfDoc.addPage([pngDims.width, pngDims.height]);
        const { width, height } = page.getSize();
        page.drawImage(pngImage, {
            x: 0,
            y: 0,
            width,
            height,
        });
    }
    async createPDF() {
        try {
            const pdfDoc = await pdf_lib_1.PDFDocument.create();
            const pngFiles = await new Promise((resolve, reject) => {
                fs.readdir('pdf', (err, files) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(files);
                    }
                });
            });
            for (const pngFilePath of pngFiles) {
                await this.pngToPdf(`pdf/${pngFilePath}`, pdfDoc);
                fs.unlink(`pdf/${pngFilePath}`, () => { });
            }
            const pdfBytes = await pdfDoc.save();
            const bufferData = Buffer.from(pdfBytes);
            return bufferData.toString('base64');
        }
        catch (error) {
            console.error('Error creating PDF:', error);
        }
    }
};
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
//# sourceMappingURL=app.service.js.map