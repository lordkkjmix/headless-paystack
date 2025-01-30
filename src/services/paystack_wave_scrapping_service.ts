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
const getImageBase64 = async (url: string) => {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const stringifiedBuffer = Buffer.from(buffer).toString('base64');
    const contentType = response.headers.get('content-type');
    const imageBase64 =
        `data:${contentType};base64,${stringifiedBuffer}`;
    return imageBase64;
}
let transactionId: string | undefined = undefined;
function requestInterceptor(request: HTTPRequest) {
    if (request.method() == "POST" && request.url().startsWith('https://api.paystack.co/transaction/update_log')) {
        const url = request.url();
        transactionId = url.split('/').pop();
    }
}
const launchScrapper = async (paymentLink: string,) => {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({
        headless: true,
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
        args: [
            '--no-sandbox'
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
    const mobileMoneyTab = await page.waitForSelector('a[data-testid="wave_ci-nav"]');
    if (mobileMoneyTab) {
        await mobileMoneyTab.click();
    } else {
        throw new Error('Mobile Money tab not found');
    }
    const qrCodeIsVisible = await page.waitForSelector('img[name="qrCodeImage"]', { timeout: 100000 });
    // Wait for the success message
    if (qrCodeIsVisible) {
        const qrCodeImageSrc = await page.$eval('img[name="qrCodeImage', img => img.src);
        const paymentResult = await fetch(`https://standard.paystack.co/charge/requery/${transactionId}`).then(response => response.json() as {});
        const qrCodeImageBase64 = await getImageBase64(qrCodeImageSrc);
        await browser.close();
        return {
            status: 'success',
            details: {
                ...paymentResult,
                qrCode: qrCodeImageSrc,
                qrCodeImageBase64: qrCodeImageBase64,
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
};
const payStackWaveScrapping = async (paymentLink: string,) => {
    try {
        return await launchScrapper(paymentLink,);
    } catch (error) {
        console.error('An error occurred:', error);
        throw new Error("An error occurred");

    }
};
export default payStackWaveScrapping;