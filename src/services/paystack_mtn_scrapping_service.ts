import puppeteer from 'puppeteer-extra';
import { Page, Browser, HTTPRequest } from 'puppeteer';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(StealthPlugin());

const verifyErrorPage = async (page: Page, browser: Browser) => {
    try {
        const errorDiv = await page.waitForSelector('.setup-error', { timeout: 2000 });
        if (errorDiv) {
            const errorMessage = await errorDiv.$eval('.setup-error__message', el => el.textContent);
            await browser.close();
            return {
                status: 'error',
                message: errorMessage,
            };
        }
        return true;
    } catch (error) {
        return true;
    }
}
let transactionId: string | undefined = undefined;
function requestInterceptor(request: HTTPRequest) {
    if (request.method() == "POST" && request.url().startsWith('https://api.paystack.co/transaction/update_log')) {
        const url = request.url();
        transactionId = url.split('/').pop();
    }
}
const payStackMTNScrapping = async (paymentLink: string, phoneNumber: string) => {
    try {
        // Launch the browser and open a new blank page
        const browser = await puppeteer.launch({
            headless: true,
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH ?? '/usr/bin/chromium',
            args: ['--no-sandbox'
            ],
            timeout: 10_000, // 10 seconds
            protocolTimeout: 20_000,
        });
        const page = await browser.newPage();
        // Navigate the page to a URL
        await page.goto(paymentLink, { waitUntil: "networkidle2", timeout: 70000 });
        page.on('request', requestInterceptor);
        await page.waitForSelector('#app', { timeout: 50000 });
        //detect 404 page
        await verifyErrorPage(page, browser);
        // Click on the mobile money tab
        const mobileMoneyTab = await page.waitForSelector('a[data-testid="mtn_ci-nav"]');
        if (mobileMoneyTab) {
            await mobileMoneyTab.click();
        } else {
            throw new Error('Mobile Money tab not found');
        }
        const inputSelector = await page.waitForSelector('input[name="phoneNumber"]', { timeout: 20000 });
        if (inputSelector) {
            await inputSelector.type(phoneNumber);
        }
        // Click the submit button
        const submitButton = await page.waitForSelector('button[type="submit"]', { timeout: 20000 });
        if (submitButton) {
            await submitButton.click();
        }
        // Wait for the success message
        if (transactionId) {
            await browser.close();
            return {
                status: 'success',
                details: {
                    qrCode: "https://checkout.paystack.com/assets/mtn-app-qr-code-C6CWeotp.svg"
                },
                transactionId: transactionId
            };
        } else {
            return {
                status: 'error',
                message: 'An error occurred',
                transactionId: transactionId
            };
        }
        // Close the browser
    } catch (error) {
        console.error('An error occurred:', error);
        throw new Error("An error occurred");

    }
};
export default payStackMTNScrapping;