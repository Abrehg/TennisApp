import fetch from 'node-fetch';
import { HttpsProxyAgent } from 'https-proxy-agent'

const proxyUrl = 'http://brd-customer-hl_74a6dbf2-zone-tortue_tennis_testing_01:g4wsac8d9pux@brd.superproxy.io:22225';

let profileQueryUrlUTR = "https://api.utrsports.net/v2/search?schoolClubSearch=true&query=juan+carlos+portilla+morales&top=10&skip=0";

const agent = new HttpsProxyAgent(proxyUrl)

const optionsProfileQueryUTR = {
    headers: {
        'accept': 'application/json, text/plain, */*',
        'accept-language': 'en-US,en;q=0.9',
        'sec-ch-ua': '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'x-client-name': 'buildId - 66730',
        'Referer': 'https://app.utrsports.net/',
        'Referrer-Policy': 'strict-origin-when-cross-origin'
    },
    body: null,
    method: 'GET',
    agent: agent
};

const response = await fetch(profileQueryUrlUTR, optionsProfileQueryUTR)
let data = await response.json()
console.log(data)