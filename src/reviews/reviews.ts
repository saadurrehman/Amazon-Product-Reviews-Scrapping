import puppeteer, { Browser, Page } from 'puppeteer';
import { AMAZON_REVIEW_PAGE, CHROME_PATH } from '../constant';

const URL =
  'https://www.amazon.com/crocs-Unisex-Classic-Black-Women/dp/B0014C5S7S/ref=zg_bs_c_fashion_sccl_1/136-3817711-3398930?pd_rd_w=nytLk&content-id=amzn1.sym.309d45c5-3eba-4f62-9bb2-0acdcf0662e7&pf_rd_p=309d45c5-3eba-4f62-9bb2-0acdcf0662e7&pf_rd_r=DR9E6T6DGD1EG2587NK2&pd_rd_wg=OeAAM&pd_rd_r=55b54886-209b-4bca-9ad4-a8d33514730f&pd_rd_i=B0014C5S7S&th=1&psc=1';

export class Reviews {
  browser: Browser;
  currentPage: Page;
  productNames = [];

  async getUrlVisitPage(url: string) {
    const browser = await puppeteer.launch({
      headless: true, // headless:false for testing
      executablePath: CHROME_PATH,
    });

    this.browser = browser;
    this.currentPage = await browser.newPage();
    await this.currentPage.goto(url, { waitUntil: 'networkidle2' });
  }

  async getProductRating() {
    return await this.currentPage.evaluate(() => {
      const element = document.querySelector(
        '#acrPopover > span.a-declarative > a > span',
      );
      return element ? element.textContent : null;
    });
  }

  async getIsReviewExistOnPage() {
    return await this.currentPage.evaluate(() => {
      const element = document.querySelector('#cr-pagination-footer-0 > a');
      return element || null;
    });
  }

  async getNextButton() {
    try {
      const nextButton = await this.currentPage.$(AMAZON_REVIEW_PAGE.NEXT_PAGE);
      if (nextButton) {
        const isNextButtonDisabled = await this.currentPage.evaluate(
          (button) => (button as HTMLButtonElement).textContent,
          nextButton,
        );

        if (isNextButtonDisabled) return false;
        return true;
      }

      return true;
    } catch (err) {
      return true;
    }
  }

  isNextButtonDisabled = async () => {
    console.log('checking next button');
    try {
      const nextButton = await this.getNextButton();
      console.log('typeof btn', typeof nextButton === 'boolean');
      return nextButton;
    } catch (err) {
      console.log('errrrrrrr', err);
      throw err;
    }
  };

  async getReviewDetailsOfReviewer(): Promise<any[]> {
    console.log('names');

    return new Promise(async (resolve) => {
      resolve(
        await this.currentPage.evaluate(() => {
          const userNames = Array.from(
            document.querySelectorAll('#cm_cr-review_list > div'),
          );

          return [
            userNames.map(
              (product) =>
                product.querySelector(
                  'div > div > div > div:nth-child(1) > a > div.a-profile-content > span',
                )?.textContent || '',
            ),
            userNames.map(
              (product) =>
                product.querySelector(
                  'div > div > div > div.a-row.a-spacing-small.review-data > span > span',
                )?.textContent || '',
            ),
          ];
        }),
      );
    });
  }
  async takeScreenshot() {
    await this.currentPage.screenshot({
      path: './pdf/' + 'page' + new Date().getTime() + '.png',
      fullPage: true,
    });
  }
}
