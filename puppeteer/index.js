const puppeteer = require('puppeteer');

let sessionData = {}; // Variable to store session data
let localStorageData = {}; // Variable to store local storage data
let cookieData = []; // Variable to store cookie data

async function loginAndStoreSession() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    try {
        if (Object.keys(localStorageData).length === 0) {
            await page.goto('https://devfeedns.tiger75.com/');

            // Wait for the login form to appear
            await page.waitForSelector('[name="username"]', { visible: true });

            // Fill in the username
            await page.type('[name="username"]', 'admin');

            // Fill in the password
            await page.type('[name="password"]', 'matrix');

            // Submit the login form
            await page.click('button[type="submit"]');

            // Wait for navigation to complete
            await page.waitForNavigation();

            console.log('Login successful');

            // Get all keys from session storage
            sessionData = await page.evaluate(() => {
                const keys = {};
                for (let i = 0; i < sessionStorage.length; i++) {
                    const key = sessionStorage.key(i);
                    const value = sessionStorage.getItem(key);
                    keys[key] = value;
                }
                return keys;
            });

            console.log('Session data:', sessionData);

            // Get all keys from local storage
            localStorageData = await page.evaluate(() => {
                const keys = {};
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    const value = localStorage.getItem(key);
                    keys[key] = value;
                }
                return keys;
            });

            console.log('Local storage data:', localStorageData);

            // Get all cookies
            cookieData = await page.cookies();
            console.log('Cookie data:', cookieData);

        } else {
            // Set sessionData into session storage
            await page.goto('https://devfeedns.tiger75.com/');

            await page.evaluate(sessionData => {
                for (const key in sessionData) {
                    sessionStorage.setItem(key, sessionData[key]);
                }
            }, sessionData);

            console.log('Session data already exists, set into session storage');

            // Set localStorageData into local storage
            await page.evaluate(localStorageData => {
                for (const key in localStorageData) {
                    localStorage.setItem(key, localStorageData[key]);
                }
            }, localStorageData);

            console.log('Local storage data already exists, set into local storage');

            // Set cookieData
            for (const cookie of cookieData) {
                await page.setCookie(cookie);
            }

            console.log('Cookie data already exists, set as cookies');

        }
    } catch (error) {
        console.error('Error during login:', error);
    } finally {
        // Schedule next login attempt after 10 seconds
        setTimeout(loginAndStoreSession, 10000);
    }
}

// Start the login process
loginAndStoreSession();
