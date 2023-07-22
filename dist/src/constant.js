"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REGEX_API_PATTERN = exports.AMAZON_REVIEW_PAGE = exports.CHROME_PATH = void 0;
exports.CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
exports.AMAZON_REVIEW_PAGE = {
    NEXT_PAGE: '#cm_cr-pagination_bar > ul > li.a-last > a',
    ALL_REVIEWS_BUTTON: '#cr-pagination-footer-0 > a',
    ALL_REVIEW_PAGE: '#cm_cr-rvw_summary-viewpoints > div > div.a-column.a-span6.view-point-review.positive-review',
};
exports.REGEX_API_PATTERN = /^https:\/\/www\.amazon\.com\/hz\/reviews-render\/ajax\/reviews\/get\/ref=.*/;
//# sourceMappingURL=constant.js.map