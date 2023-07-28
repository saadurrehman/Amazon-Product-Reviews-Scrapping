import { Injectable } from '@nestjs/common';
import { AMAZON_REVIEW_PAGE, REGEX_API_PATTERN } from './constant';
import { Reviews } from './reviews/reviews';
import { PDFDocument } from 'pdf-lib';
import * as fs from 'fs';

@Injectable()
export class AppService extends Reviews {
  async getReviews(url: string): Promise<string> {
    await this.getUrlVisitPage(url);
    await this.currentPage.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    const productRating = await this.getProductRating();
    await this.currentPage.waitForTimeout(3000);
    const isAllReviewExist = await this.getIsReviewExistOnPage();

    if (isAllReviewExist) {
      try {
        await this.currentPage.click(AMAZON_REVIEW_PAGE.ALL_REVIEWS_BUTTON);
        await this.currentPage.waitForSelector(
          AMAZON_REVIEW_PAGE.ALL_REVIEW_PAGE,
        );
        await this.currentPage.waitForTimeout(3000);

        await this.takeScreenshot();

        await this.getReviewDetailsOfReviewer();
        const buffer = await this.processPages();
        console.log('got data');
        return buffer;
      } catch (err) {
        console.log(err);
        console.log('productNames', this.productNames);
      }
    } else {
      console.log('not exist');
    }

    return null;
    // return 'Hello World!h';
  }

  async processPages() {
    console.log('process pdf');
    return new Promise<string>((resolve) => {
      (async () => {
        do {
          try {
            console.log('step1');
            await this.currentPage.waitForTimeout(5000);
            await this.currentPage.waitForSelector(
              AMAZON_REVIEW_PAGE.NEXT_PAGE,
            );
            console.log('step click');
            await this.currentPage.click(AMAZON_REVIEW_PAGE.NEXT_PAGE);

            const responseMatchesPattern = (response) =>
              REGEX_API_PATTERN.test(response.url());

            console.log('step response');
            await this.currentPage.waitForResponse(responseMatchesPattern, {
              timeout: 60 * 1000,
            });

            await this.currentPage.waitForTimeout(3000);

            await this.takeScreenshot();

            const names = await this.getReviewDetailsOfReviewer();
            console.log('step response names');
            this.productNames = [...this.productNames, ...names];
          } catch (err) {
            console.log('err', err);
            throw err;
          }

          const isBtnNtDisabled = await this.isNextButtonDisabled();
          console.log('isBtnDisabled', isBtnNtDisabled);
          if (isBtnNtDisabled) break;
        } while (true);

        // merge all pdfs
        console.log('merging pdf');
        const data = await this.createPDF();
        console.log('seing data back');
        resolve(data);
      })();
    });
  }

  // Function to read a PNG file and convert it to PDF
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
      const pdfDoc = await PDFDocument.create();

      const pngFiles: string[] = await new Promise((resolve, reject) => {
        fs.readdir('pdf', (err, files) => {
          if (err) {
            reject(err);
          } else {
            resolve(files);
          }
        });
      });

      for (const pngFilePath of pngFiles) {
        await this.pngToPdf(`pdf/${pngFilePath}`, pdfDoc);
        fs.unlink(`pdf/${pngFilePath}`, () => {});
      }

      // Save the PDF to a file
      const pdfBytes = await pdfDoc.save();
      const bufferData = Buffer.from(pdfBytes);

      // right now i dont want to save it on server
      // fs.writeFileSync('output.pdf', pdfBytes);
      return bufferData.toString('base64');
    } catch (error) {
      console.error('Error creating PDF:', error);
    }
  }
}
