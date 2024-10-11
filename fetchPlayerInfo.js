// Import the node-fetch package
import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import { HttpsProxyAgent } from 'https-proxy-agent'
import pkg from 'jssoup';
import puppeteer from 'puppeteer'
import https from 'https'
const JSSoup = pkg.default

// Define Proxy URL
const proxyUrl = 'http://brd-customer-hl_74a6dbf2-zone-tortue_tennis_testing_01:g4wsac8d9pux@brd.superproxy.io:22225';

// Define the path to the file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const path = `${__dirname}/players_database.json`;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//Not working, assume it returns a 2D array of strings
async function getPlayerPlayHistoryUSTA(ID){

    const agent = new HttpsProxyAgent(proxyUrl)

    let url = 'https://www.usta.com/en/home/play/player-search/profile.html#uaid=' + ID

    let tournaments = []


    return tournaments
}

// let data = await getPlayerPlayHistoryUSTA('2010845482')
// console.log(data)

async function updateDatabaseEntriesPlayers(){
    let database = await loadDatabasePlayers()

    for(let i = 0; i < database.length; i++){
        ["Full Name","UTR ID","ITF ID","USTA ID","UTR Singles Rating","UTR Doubles Rating","ITF Singles Rating","ITF Doubles Rating","USTA Singles Rating","USTA Doubles Rating","Flags"]
        
        if(database[i][10].includes("No UTR Data") != true){
            if(database[i][1] != "NA"){
                let UTRData = await GetPlayerUTRbyID(database[i][1])
                if(UTRData[1].length > 1 && UTRData[2].length > 1){
                    database[i][4] = UTRData[1][1]
                    database[i][5] = UTRData[2][1]
                }
                else{
                    database[i][10].push("No UTR Data")
                }
            }
            else{
                let UTRData = await GetPlayerInfoUTR(database[i][0])
                if(UTRData[1].length > 1 && UTRData[2].length > 1 && UTRData[3].length > 1){
                    database[i][4] = UTRData[1][1]
                    database[i][5] = UTRData[2][1]
                    database[i][1] = UTRData[3][1]
                }
                else{
                    database[i][10].push("No UTR Data")
                }
            }
        }

        if(database[i][10].includes("No ITF Data") != true){
            GetPlayerInfoITFID(circuitCode,ID)
            [["Full Name"],["Singles Rating"],["Doubles Rating"]]
            if(database[i][1] != "NA"){
                let ITFData = "NA"
                let circuitCodes = ["JT", "MT", "WT", "VT", "WCT", "BT"]
                for(circCode in circuitCodes){
                    ITFData = await GetPlayerInfoITFID(circCode, database[i][2])
                    if(ITFData[1].length > 1 && ITFData[2].length > 1){
                        database[i][4] = ITFData[1][1]
                        database[i][5] = ITFData[2][1]
                    }
                }
                if(ITFData == "NA"){
                    database[i][10].push("No ITF Data")
                }
            }
            else{
                let ITFData = await GetPlayerInfoITF(database[i][0])
                if(ITFData[1].length > 1 && ITFData[2].length > 1 && ITFData[3].length > 1){
                    database[i][4] = ITFData[1][1]
                    database[i][5] = ITFData[2][1]
                    database[i][1] = ITFData[3][1]
                }
                else{
                    database[i][10].push("No ITF Data")
                }
            }
        }

        if(database[i][10].includes("No USTA Data") != true){
            //Find out how to update the USTA data later
        }
    }

    await saveDatabasePlayers(database)
}

// Fetch player history USTA
const agent = new HttpsProxyAgent(proxyUrl)
// let data = await fetch("https://services.usta.com/v1/dataexchange/playhistory", {
//     "headers": {
//       "accept": "application/json, text/plain, */*",
//       "accept-language": "en-US,en;q=0.9",
//       //"authorization": "Bearer eyJraWQiOiJseXN3RVFyMk41Z1ZzZ3RYckF0RmVtMmdhV0dcL3lzNXFONGJueGxUQ2Y4TT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI3MjhkNjdhMS1iMjUyLTRmZjItYWNjMC0yZWQyM2EwOTcxNmIiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9zdUd0NmViSkQiLCJ2ZXJzaW9uIjoyLCJjbGllbnRfaWQiOiIyNHZpOHJ0amR2ZzUwMGJldGIyNTg1dXE3dCIsImV2ZW50X2lkIjoiZmIxYzcyY2UtZGUxMy00YjU0LWExZDctYzE0NDhhNTFmZmU2IiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhcGktY29tbWVyY2VcL3BheW1lbnQ6cmVhZCBhcGktY3VzdG9tZXJcL2N1c3RvbWVyOmNyZWF0ZSBhcGktc2FmZXNwb3J0XC9jb3Vyc2V3b3JrOndyaXRlIGFwaS1jb2duaXRvLWFkbWluXC9jYWxsYmFjay51cmw6cmVhZCBhcGktY3VzdG9tZXJcL3BsYXllcjp1bmJvdW5kOnJlYWQgYXBpLWN1c3RvbWVyXC9wcm92aWRlcjpyZWFkIGFwaS1yYXRpbmdzXC9jb21wZXRpdGlvbjp1cGRhdGUgYXBpLWN1c3RvbWVyXC9jdXN0b21lci5tZW1iZXJzaGlwLmZhbWlseTpyZWFkIGFwaS1jdXN0b21lclwvc3VzcGVuc2lvbjpyZWFkIGFwaS1mYWNpbGl0eVwvZmFjaWxpdHk6Y3JlYXRlIGFwaS1jdXN0b21lclwvY3VzdG9tZXI6cmVhZCBhcGktY3VzdG9tZXJcL2lkZW50aXR5OnVwZGF0ZSBhcGktcHJvZ3JhbVwvcHJvZ3JhbTpkZWxldGVfdW5ib3VuZCBhcGktY3VzdG9tZXJcL2N1c3RvbWVyOnVwZGF0ZSBhcGktY29tbWVyY2VcL3BheW1lbnQ6cGVyZm9ybSBhcGktY29tbW9uXC9yZWZlcmVuY2UuZGF0YTpyZWFkIGFwaS1jdXN0b21lclwvY3VzdG9tZXIucHJvZ3JhbTptYW5hZ2UgYXBpLWZhY2lsaXR5XC9mYWNpbGl0eTpyZWFkX3VuYm91bmQgYXBpLWN1c3RvbWVyXC9wbGF5ZXI6dXBkYXRlIGFwaS1jdXN0b21lclwvc2NoZWR1bGU6cmVhZCBhcGktb3JnYW5pemF0aW9uXC9vcmdhbml6YXRpb246Y3JlYXRlX3VwZGF0ZSBhcGktcmFua2luZ3NcL3Jhbmtpbmc6cmVhZCBhcGktcmF0aW5nc1wvY29hY2g6cmVhZF91cGRhdGUgYXBpLWN1c3RvbWVyXC9wbGF5aGlzdG9yeTpyZWFkX3VuYm91bmQgYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4gYXBpLXByb2dyYW1cL3Byb2dyYW06Y3JlYXRlX3VuYm91bmQgb3BlbmlkIGFwaS1vcmdhbml6YXRpb25cL29yZ2FuaXphdGlvbjpyZWFkIHByb2ZpbGUgYXBpLWN1c3RvbWVyXC9wbGF5aGlzdG9yeTpyZWFkIGFwaS1jdXN0b21lclwvc2NoZWR1bGU6cmVhZF91bmJvdW5kIGFwaS1jb21tZXJjZVwvb3JkZXI6cmVhZF91cGRhdGUgYXBpLXNhZmVzcG9ydFwvY291cnNld29yazpyZWFkIGFwaS1wcm9ncmFtXC9wcm9ncmFtOnVwZGF0ZV91bmJvdW5kIGFwaS1yYW5raW5nc1wvcmFua2luZzpyZWFkX3VuYm91bmQgYXBpLWN1c3RvbWVyXC9wbGF5ZXI6cmVhZCBhcGktcHJvZ3JhbVwvcHJvZ3JhbTpyZWFkX3VuYm91bmQiLCJhdXRoX3RpbWUiOjE3MjE4NTYzNzgsImV4cCI6MTcyMzE1NDMyMywiaWF0IjoxNzIzMTUwNzIzLCJqdGkiOiJlZjYxODgwYy1kNmVhLTRkZDUtODc5Yy1mNzc1YTVhNzk4ZjkiLCJ1c2VybmFtZSI6IjcyOGQ2N2ExLWIyNTItNGZmMi1hY2MwLTJlZDIzYTA5NzE2YiJ9.Jd60FYGuZ1vQtXEzqZCx8o6D7xjTF1HE4VJTqwbeobp8h1GjdvOeXS_N0Izw9-h_Lek1TjMzfVi7AmZ9ttK8_fQlqnXWr3jO8OdKhB1WhIReog0d2-W9JM80V8aKlRIiWvqTQ8a5ZSjXtdRndps0B_8myGr9O48-qXCW6U9K2PiC2axKQ8JN0xbhkUVhyH_xi9b2widHqIyAJ5PXujHvzenBlda8Lj8Ugm7mKsgJP6525Wf3xFVa95Aa5vwq06Di2TlKx3PQ2I5k1nEY4nmw_zxxfBFQSGcoS9wzql08WMbEEXzsZPeekNLPuUjIp5IJ8pHGbd8W68e_sYoNmK2E2Q",
//       "content-type": "application/json",
//       "sec-ch-ua": "\"Google Chrome\";v=\"123\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
//       "sec-ch-ua-mobile": "?0",
//       "sec-ch-ua-platform": "\"macOS\"",
//       "sec-fetch-dest": "empty",
//       "sec-fetch-mode": "cors",
//       "sec-fetch-site": "same-site",
//       "Referer": "https://www.usta.com/",
//       "Referrer-Policy": "strict-origin-when-cross-origin",
//       "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
//     },
//     "body": "{\"selection\":{\"uaid\":\"2010845482\",\"eventType\":\"ALL\",\"year\":\"all\"},\"pagination\":{\"pageSize\":15,\"currentPage\":1}}",
//     "method": "POST"
// });
// data = await data.text()
// console.log(data)


//Used for saving and loading locally for testing
// const saveData = async (jsonData) => {
//     try {
//         const dataPath = `${__dirname}/data.json`
//         const dataString = JSON.stringify(jsonData, null, 2); // Convert JSON to string with indentation
//         await fs.promises.writeFile(dataPath, dataString, { encoding: 'utf8' });
//         console.log('Data saved successfully.');
//     } catch (error) {
//         console.error('Error saving data:', error);
//     }
// }

// const loadData = async () => {
//     try {
//         const dataPath = `${__dirname}/data.json`
//         const dataString = await fs.promises.readFile(dataPath, { encoding: 'utf8' });
//         const jsonData = JSON.parse(dataString); // Convert string to JSON
//         console.log('Data loaded successfully:');
//         return jsonData;
//     } catch (error) {
//         console.error('Error loading data:', error);
//     }
// }

//Check if player history matches between ITF and UTR
async function checkHistoriesITFUTR(ITFID, UTRID){
    const agent = new HttpsProxyAgent(proxyUrl)
    let UTRRecURL = "https://api.utrsports.net/v4/player/" + UTRID + "/results?type=s&year=last"
    let UTRRecOpt = {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-US,en;q=0.9",
            "newrelic": "eyJ2IjpbMCwxXSwiZCI6eyJ0eSI6IkJyb3dzZXIiLCJhYyI6IjMwMjgxMjMiLCJhcCI6IjUzOTYzMzgzOCIsImlkIjoiZWJkODBkNTkwNzU2NTZjYyIsInRyIjoiNmVlMDRjZDI1NDI2ODViYzRjYjgzYmIyNDNmMzhlZjAiLCJ0aSI6MTcyMTE3NzQ2NTgyMX19",
            "sec-ch-ua": "\"Google Chrome\";v=\"123\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "x-client-name": "buildId - 70972",
            "Referer": "https://app.utrsports.net/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET",
        "agent" : agent
    }
    async function fetchDataUTR() {
        try {
            const response = await fetch(UTRRecURL, UTRRecOpt);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;  // Return the JSON object directly
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
            return null;  // Return null in case of an error
        }
    }
    async function fetchDataITF(circCodeTemp) {
        let ITFRecURL = "https://www.itftennis.com/tennis/api/PlayerApi/GetPlayerActivity?circuitCode=" + circCodeTemp + "&matchTypeCode=S&playerId=" + ITFID + "&skip=0&surfaceCode=&take=20&tourCategoryCode=&year="
        let ITFRecOpt = {
            "headers": {
                "accept": "*/*",
                "accept-language": "en-US,en;q=0.9",
                "sec-ch-ua": "\"Google Chrome\";v=\"123\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin"
            },
            "referrerPolicy": "no-referrer",
            "body": null,
            "method": "GET",
            "agent" : agent
        }
        try {
            const response = await fetch(ITFRecURL, ITFRecOpt);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;  // Return the JSON object directly
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
            return null;  // Return null in case of an error
        }
    }

    let circCodes = ["WCT", "VT", "WT", "MT", "JT", "BT"]
    let ITFData = []
    console.log("Starting to get ITF data for history verification")
    for(let i = 0; i < circCodes.length; i++){
        await sleep(5000)
        console.log(circCodes[i])
        let Out = await fetchDataITF(circCodes[i])
        if(Out.totalItems > 0){
            for(let j = 0; j < Out.items.length; j++){
                ITFData.push(Out.items[j])
            }
        }
    }
    console.log("Starting to get UTR data for history verification")
    let UTRData = await fetchDataUTR()
    await sleep(5000)

    console.log("Recieved ITF and UTR data")

    let count = 0
    for(let i = 0; i < UTRData.events.length; i++){
        for(let j = 0; j < ITFData.length; j++){
            if(UTRData.events[i].name == ITFData[j].tournamentName){
                count++
            }
        }
    }
    console.log("Matches: " + count)

    let perc = count/ITFData.length
    console.log("Percent: " + perc)
    if(perc >= 0.5){
        return true
    }
    else{
        return false
    }
}
// // Fetch UTR event history
// let UTRId = "2802438"

// // Fetch ITF event history
// let ITFId = "800598540"

// let output = await checkHistories(ITFId, UTRId)
// console.log(output)

async function checkHistoriesUTRUSTA(USTAID, UTRID){
    const agent = new HttpsProxyAgent(proxyUrl)
    let UTRRecURL = "https://api.utrsports.net/v4/player/" + UTRID + "/results?type=s&year=last"
    let UTRRecOpt = {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-US,en;q=0.9",
            "newrelic": "eyJ2IjpbMCwxXSwiZCI6eyJ0eSI6IkJyb3dzZXIiLCJhYyI6IjMwMjgxMjMiLCJhcCI6IjUzOTYzMzgzOCIsImlkIjoiZWJkODBkNTkwNzU2NTZjYyIsInRyIjoiNmVlMDRjZDI1NDI2ODViYzRjYjgzYmIyNDNmMzhlZjAiLCJ0aSI6MTcyMTE3NzQ2NTgyMX19",
            "sec-ch-ua": "\"Google Chrome\";v=\"123\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "x-client-name": "buildId - 70972",
            "cookie": "OptanonAlertBoxClosed=2024-05-14T22:49:17.156Z; _shopify_y=4a6c3b27-7497-4d05-aa3c-ba9f7c80581a; _tracking_consent=%7B%22con%22%3A%7B%22CMP%22%3A%7B%22a%22%3A%221%22%2C%22m%22%3A%221%22%2C%22p%22%3A%221%22%2C%22s%22%3A%22%22%7D%7D%2C%22v%22%3A%222.1%22%2C%22region%22%3A%22USNJ%22%2C%22reg%22%3A%22%22%7D; _cmp_a=%7B%22purposes%22%3A%7B%22a%22%3Atrue%2C%22p%22%3Atrue%2C%22m%22%3Atrue%2C%22t%22%3Atrue%7D%2C%22display_banner%22%3Afalse%2C%22sale_of_data_region%22%3Afalse%7D; _orig_referrer=https%3A%2F%2Fapp.utrsports.net%2F; _landing_page=%2F; jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNZW1iZXJJZCI6IjEzNjQwODIiLCJlbWFpbCI6IjduazZmN2Z5MjJAcHJpdmF0ZXJlbGF5LmFwcGxlaWQuY29tIiwiVmVyc2lvbiI6IjEiLCJEZXZpY2VMb2dpbklkIjoiMjAyOTA0NTUiLCJuYmYiOjE3MjA3OTQwODMsImV4cCI6MTcyMzM4NjA4MywiaWF0IjoxNzIwNzk0MDgzfQ.cw4ASDiFSdNzggXGhcIOAzJ0HmQmFYJwEOwpwWZRC_E; ut_user_info=SubscriptionType%3DFree%26MemberId%3D1364082%26Email%3D7nk6f7fy22%40privaterelay.appleid.com; OptanonConsent=isGpcEnabled=0&datestamp=Tue+Jul+16+2024+20%3A51%3A04+GMT-0400+(Eastern+Daylight+Time)&version=202311.1.0&browserGpcFlag=0&isIABGlobal=false&hosts=&consentId=1c1cab54-eb20-42b8-adff-b017daddbd1c&interactionCount=1&landingPath=NotLandingPage&groups=C0002%3A1%2CC0001%3A1%2CC0004%3A1%2CC0003%3A1&geolocation=US%3BNJ&AwaitingReconsent=false",
            "Referer": "https://app.utrsports.net/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET",
        "agent" : agent
    }
    async function fetchDataUTR() {
        try {
            const response = await fetch(UTRRecURL, UTRRecOpt);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;  // Return the JSON object directly
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
            return null;  // Return null in case of an error
        }
    }

    // Get USTA Data
    let USTAData = getPlayerPlayHistoryUSTA(USTAID)

    console.log("Starting to get UTR data for history verification")
    let UTRData = await fetchDataUTR()
    await sleep(5000)

    console.log("Recieved UTR and USTA data")

    let count = 0
    for(let i = 0; i < UTRData.events.length; i++){
        for(let j = 0; j < USTAData.length; j++){
            if(UTRData.events[i].name == USTAData[j]){
                count++
            }
        }
    }
    console.log("Matches: " + count)

    let perc = count/USTAData.length
    console.log("Percent: " + perc)
    if(perc >= 0.5){
        return true
    }
    else{
        return false
    }
}

async function loadDatabasePlayers() {
    try {
        if (fs.existsSync(path)) {
            // Read the file and parse it as JSON
            const data = await fs.promises.readFile(path, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error loading database:', error);
    }
    // Return an empty array if the file does not exist
    return ["Full Name","UTR ID","ITF ID","USTA ID","UTR Singles Rating","UTR Doubles Rating","ITF Singles Rating","ITF Doubles Rating","USTA Singles Rating","USTA Doubles Rating","Flags"];
    // return [["name","ID"]];
}

// Function to save the database to disk
async function saveDatabasePlayers(database) {
    try {
        // Convert the array to a JSON string and write it to the file
        const databaseData = JSON.stringify(database, null, 2);
        await fs.promises.writeFile(path, databaseData, 'utf8');
    } catch (error) {
        console.error('Error saving database:', error);
    }
}

// Function to check and update the database
// Update function to work with USTA
export async function checkAndUpdateDatabasePlayersUTR(Name, UTRID) {
    let database = await loadDatabasePlayers()

    // Find the index of the row that contains the UTRID
    let rowIndex = database.findIndex(row => row[1] === UTRID);

    let array = [["UTR Singles Rating"], ["UTR Doubles Rating"], ["ITF Singles Rating"], ["ITF Doubles Rating"], ["USTA Singles Rating"], ["USTA Doubles Rating"]]

    console.log("Starting database checking and update")
    console.log(rowIndex)
    if (rowIndex !== -1) {
        // Access data from existing row
        let existingRow = database[rowIndex];
        array[0].push(existingRow[4])
        array[1].push(existingRow[5])
        array[2].push(existingRow[6])
        array[3].push(existingRow[7])
        array[4].push(existingRow[8])
        array[5].push(existingRow[9])
    } else {
        // If the ID does not exist, append a new row with the name and ID
        let UTRDataOut = await GetPlayerUTRbyID(UTRID)
        console.log(Name)
        console.log(UTRDataOut[0][1])

        //Temporary values
        let item = [Name, UTRID, "NA", "NA", 0, 0, 0, 0, 0, 0, []]
        array[0].push(0)
        array[1].push(0)
        array[2].push(0)
        array[3].push(0)
        array[4].push(0)
        array[5].push(0)

        if (UTRDataOut[0].length > 1 && UTRDataOut[0][1] == Name) {
            console.log("Inner check reached")

            // Get information from UTR
            console.log("UTR Data Out")
            console.log(UTRDataOut)
            // Check if UTR data exists, then update array
            if(UTRDataOut[1].length > 1 && UTRDataOut[2].length > 1){
                array[0][1] = UTRDataOut[1][1]
                array[1][1] = UTRDataOut[2][1]
            }

            // Get information from ITF
            console.log("Starting to find ITF with matching UTR")
            let ITFDataOut = await GetPlayerInfoITFmatchingUTR(Name, UTRID)
            console.log("ITF Data Out")
            console.log(ITFDataOut)
            // Check if ITF Data exists, then update array
            if(ITFDataOut[1].length > 1 && ITFDataOut[2].length > 1 && ITFDataOut[3].length > 1){
                ITFIDOut = ITFDataOut[3][1]
                array[2][1] = ITFDataOut[1][1]
                array[3][1] = ITFDataOut[2][1]

                //Check to see if database entry for player already exists with ITF and no UTR
                let ITFrowIndex = database.findIndex(row => row[2] === ITFIDOut)

                //If entry exists, update UTR info and remove no UTR data flag
                if(ITFrowIndex !== -1){
                    database[ITFrowIndex][1] = UTRID
                    database[ITFrowIndex][4] = array[0][1]
                    database[ITFrowIndex][5] = array[1][1]
                    if(array[0][1] !== 0 && array[1][1] !== 0){
                        for(let tempIndex = 0; tempIndex < database[ITFrowIndex][8].length; tempIndex++){
                            if(database[ITFrowIndex][10][tempIndex] == "No UTR Data"){
                                database[ITFrowIndex][10].splice(tempIndex, 1)
                            }
                        }
                    }
                }
                //Otherwise create new entry and push to database
                else{
                    item[4] = array[0][1]
                    item[5] = array[1][1]
                    item[6] = array[2][1]
                    item[7] = array[3][1]
                    item[2] = ITFIDOut
                }
            }
            //If no ITF data, update item and push to database with appropriate flag
            else{
                item[10].push("No ITF Data")
                item[4] = array[0][1]
                item[5] = array[1][1]
                item[6] = array[2][1]
                item[7] = array[3][1]
            }

            //Get data from USTA
        }
        //If no UTR data, update item and push to database with appropriate flag
        else{
            item[10].push("No UTR Data")
            item[4] = array[0][1]
            item[5] = array[1][1]
            item[6] = array[2][1]
            item[7] = array[3][1]
            database.push(item)
        }
    }
    await saveDatabasePlayers(database)
    console.log("Finished checking and updating database")
    return array
}

//Update to work with USTA
export async function checkAndUpdateDatabasePlayersITF(Name, ITFID) {
    let database = await loadDatabasePlayers()

    // Find the index of the row that contains the UTRID
    let rowIndex = database.findIndex(row => row[1] === ITFID);

    let array = [["UTR Singles Rating"], ["UTR Doubles Rating"], ["ITF Singles Rating"], ["ITF Doubles Rating"], ["USTA Singles Rating"], ["USTA Doubles Rating"]]
    console.log("Starting database checking and update")
    if (rowIndex !== -1) {
        // Access data from existing row
        let existingRow = database[rowIndex];
        array[0].push(existingRow[4])
        array[1].push(existingRow[5])
        array[2].push(existingRow[6])
        array[3].push(existingRow[7])
        array[4].push(existingRow[8])
        array[5].push(existingRow[9])
    } else {
        // If the ID does not exist, append a new row with the name and ID
        let ITFDataOut = await GetPlayerInfoITFID(ITFID);
        console.log(Name)
        console.log(ITFDataOut[0][1])

        //Initialize objects
        let item = [Name, "NA", ITFID, "NA", 0, 0, 0, 0, 0, 0, []]
        array[0].push(0)
        array[1].push(0)
        array[2].push(0)
        array[3].push(0)
        array[4].push(0)
        array[5].push(0)

        if(ITFDataOut[1].length > 1 && ITFDataOut[2].length > 1){
            // Add information from ITF if it exists
            array[2][1] = ITFDataOut[1][1]
            array[3][1] = ITFDataOut[2][1]

            // Add information from UTR
            console.log("Starting to find UTR with matching ITF")
            let UTRDataOut = await GetPlayerInfoUTRmatchingITF(Name, ITFID)
            console.log("UTR data out")
            console.log(UTRDataOut)

            // Check if UTR data exists, then update entries if it does exist
            if(UTRDataOut[1].length > 1 && UTRDataOut[2].length > 1 && UTRDataOut[3].length > 1){
                UTRIDOut = UTRDataOut[3][1]
                array[0][1] = UTRDataOut[1][1]
                array[1][1] = UTRDataOut[2][1]

                //Check to see if database entry for player already exists with UTR and no ITF
                let UTRrowIndex = database.findIndex(row => row[1] === UTRIDOut)

                //If entry exists, update ITF info and remove no ITF data flag
                if(UTRrowIndex !== -1){
                    database[UTRrowIndex][2] = ITFID
                    database[UTRrowIndex][4] = array[0][1]
                    database[UTRrowIndex][5] = array[1][1]
                    if(array[0][1] !== 0 && array[1][1] !== 0){
                        for(let tempIndex = 0; tempIndex < database[UTRrowIndex][8].length; tempIndex++){
                            if(database[UTRrowIndex][8][tempIndex] == "No UTR Data"){
                                database[UTRrowIndex][8].splice(tempIndex, 1)
                            }
                        }
                    }
                }
                //Otherwise create new entry and push to database
                else{
                    item[4] = array[0][1]
                    item[5] = array[1][1]
                    item[6] = array[2][1]
                    item[7] = array[3][1]
                    item[1] = UTRIDOut
                    database.push(item)
                }
            }
            // Add flag if UTR data doesn't exist
            else{
                item[10].push("No UTR Data")
                item[4] = array[0][1]
                item[5] = array[1][1]
                item[6] = array[2][1]
                item[7] = array[3][1]
                database.push(item)
            }
        }

        else{
            item[10].push("No ITF Data")
            item[4] = array[0][1]
            item[5] = array[1][1]
            item[6] = array[2][1]
            item[7] = array[3][1]
            database.push(item)
        }
    }
    await saveDatabasePlayers(database)
    console.log("Finished checking and updating database")
    return array
}

export async function checkAndUpdateDatabasePlayersUSTA(Name, USTAID){
    let database = await loadDatabasePlayers()

    // Find the index of the row that contains the UTRID
    let rowIndex = database.findIndex(row => row[1] === ITFID);

    let array = [["UTR Singles Rating"], ["UTR Doubles Rating"], ["ITF Singles Rating"], ["ITF Doubles Rating"], ["USTA Singles Rating"], ["USTA Doubles Rating"]]
    console.log("Starting database checking and update")
    if (rowIndex !== -1) {
        // Access data from existing row
        let existingRow = database[rowIndex];
        array[0].push(existingRow[4])
        array[1].push(existingRow[5])
        array[2].push(existingRow[6])
        array[3].push(existingRow[7])
        array[4].push(existingRow[8])
        array[5].push(existingRow[9])
    } else {
    
    // Find USTA User data
    }
}

async function GetPlayerInfoUSTA(firstName, lastName){
    async function fetchData() {
        const agent = new HttpsProxyAgent(proxyUrl)
        try {
            const response = await fetch("https://services.usta.com/v1/dataexchange/profile/search/public", {
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "en-US,en;q=0.9",
                    "content-type": "application/json",
                    "sec-ch-ua": "\"Google Chrome\";v=\"123\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"macOS\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-site",
                    "Referer": "https://www.usta.com/",
                    "Referrer-Policy": "strict-origin-when-cross-origin",
                    "User-Agent" : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
                },
                body: JSON.stringify({
                    pagination: {
                        pageSize: "51",
                        currentPage: "1"
                    },
                    selection: {
                        name: {
                            fname: firstName,
                            lname: lastName
                        }
                    }
                }),
                method: "POST"
            });
          
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching player info:', error);
            throw error;
        }
    }

    let data = await fetchData()

    let array = ["ID"]

    if(data.data.length > 0){
        for(let i = 0; i < data.data.length; i++){
            array.push(data.data[i].uaid)
        }
    }

    return array    
}

// let dataOut = await GetPlayerInfoUSTA("parker", "schultz")
// console.log(dataOut)

async function GetPlayerInfoUSTAID(PlayerID){
    async function fetchData() {
        const agent = new HttpsProxyAgent(proxyUrl)
        try {
            const response = await fetch("https://www.usta.com/usta/api?type=playerInfo", {
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "en-US,en;q=0.9",
                    "content-type": "application/json",
                    "csrf-token": "undefined",
                    "hash": "279e947fcfb912383168802c8272b6f45a776a45f94e37972c17b356c1f2d447",
                    "sec-ch-ua": "\"Google Chrome\";v=\"123\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"macOS\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "Referer": "https://www.usta.com/en/home/play/player-search/profile.html",
                    "Referrer-Policy": "strict-origin-when-cross-origin",
                    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
                },
                body: JSON.stringify({
                    selection: {
                        uaid: "2010845482"
                    },
                    output: {
                        ratings: "true",
                        extendedProfile: "true",
                        wtn: "true"
                    }
                }),
                method: "POST",
                agent: agent
            });
          
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
          
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching player info:', error);
            throw error;
        }
    }
    
    let data = await fetchData()

    var array = [["Full Name"],["Singles Rating"],["Doubles Rating"],["ID"]];

    if(data.data.length > 0){
        array[0].push(data.data[0].name)
        array[3].push(data.data[0].uaid)
        if(data.data[0].ratings.wtn.length > 0){
            for(let i = 0; i < data.data[0].ratings.wtn.length; i++){
                if(data.data[0].ratings.wtn[i].type == "SINGLE"){
                    array[1].push(data.data[0].ratings.wtn[i].tennisNumber)
                }
                if(data.data[0].ratings.wtn[i].type == "DOUBLE"){
                    array[2].push(data.data[0].ratings.wtn[i].tennisNumber)
                }
            }
        }
    }
    
    return array
}

// let dataOut = await GetPlayerInfoUSTAID("2018939457")
// console.log(dataOut)

// Find UTR for player
async function GetPlayerInfoUTR(profileName){
    let tempArr = profileName.split(" ");
    let urlName = "";
    for (let i = 0; i < tempArr.length; i++){
        urlName = urlName + tempArr[i].toLowerCase() + "+";
    }
    urlName = urlName.substring(0,urlName.length-1);

    let profileQueryUrlUTR = "https://api.utrsports.net/v2/search?schoolClubSearch=true&query=" + urlName + "&top=10&skip=0";

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
    
    async function fetchData() {
        try {
            const response = await fetch(profileQueryUrlUTR, optionsProfileQueryUTR);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;  // Return the JSON object directly
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
            return null;  // Return null in case of an error
        }
    }

    var array = [["Full Name"],["Singles Rating"],["Doubles Rating"],["ID"]];

    let data = await fetchData();
    console.log(data)
    if (data.players.hits.length > 0) {
        if(data.players.hits[0].source.displayName.toLowerCase() == profileName.toLowerCase()){
            array[0].push(data.players.hits[0].source.displayName);
            array[1].push(data.players.hits[0].source.singlesUtr);
            array[2].push(data.players.hits[0].source.doublesUtr);
            array[3].push(data.players.hits[0].id);
        }
    } else {
        console.log('No available data');
    }
    return array;
}

// let profileNameUTR = 'juan carlos portilla morales'
// let output = await GetPlayerInfoUTR(profileNameUTR)
// console.log(output)

// Fetch profile for ITF ranking
async function GetPlayerInfoITF(profileName, tournCircuitCode){
    let tempArr = profileName.split(" ");
    let urlName = "";
    for (let i = 0; i < tempArr.length; i++){
        urlName = urlName + tempArr[i].toLowerCase() + "%20";
    }
    urlName = urlName.substring(0,urlName.length-3);

    const agent = new HttpsProxyAgent(proxyUrl)

    let profileQueryUrlITF = "https://www.itftennis.com/tennis/api/SearchApi/Search?searchString=" + urlName;

    const optionsProfileQueryITF = {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "if-none-match": "\"db190aaa-e10b-489a-b6be-186123606aff\"",
            "sec-ch-ua": "\"Google Chrome\";v=\"123\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "no-cors",
            "sec-fetch-site": "same-origin"
        },
        "referrerPolicy": "no-referrer",
        "body": null,
        "method": "GET",
        //"agent": agent
    };

    async function fetchWithRetry(url, options, retries = 3, backoff = 1000) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } 
        catch (error) {
            if (retries > 0) {
                console.error(`Fetch failed: ${error.message}. Retrying in ${backoff}ms...`);
                await new Promise(resolve => setTimeout(resolve, backoff));
                return fetchWithRetry(url, options, retries - 1, backoff * 2);
            } 
            else {
                console.error(`Fetch failed after ${retries} retries: ${error.message}`);
                await new Promise(resolve => setTimeout(resolve, backoff)); // Delay after final failure
                throw error;
            }
        }
    }

    var array = [["Full Name"],["Singles Rating"],["Doubles Rating"],["ID"]];

    let data = await fetchWithRetry(profileQueryUrlITF, optionsProfileQueryITF);
    
    console.log("Starting GetPlayerInfoITF")
    if(data){
        if (data.players.length > 0) {
            for(let integer = 0; integer < data.players.length; integer++){
                console.log("Player: ")
                console.log(data.players[integer])
                for(let index = 0; index < data.players[integer].playedCircuits.length; index++){
                    console.log(data.players[integer].playedCircuits[index].value)
                    console.log(tournCircuitCode)
                    if(data.players[integer].playedCircuits[index].value == tournCircuitCode){
                        array[0].push(data.players[integer].FullName)
                        array[3].push(data.players[integer].playerId)
                        let Id = data.players[integer].playerId;
                        let prefixes = ["JT", "MT", "FT", "VT", "WCT", "BT"]
                        for (const prefix of prefixes) {
                            try {
                                console.log("Checking " + prefix)
                                let dataRankings = await GetPlayerInfoITFID(prefix, Id);
                                console.log(dataRankings);
                                if (dataRankings[1].length > 1 || dataRankings[2].length > 1) {
                                    console.log(`${prefix} singles: ${dataRankings[1][1]}`);
                                    array[1].push(dataRankings[1][1]);
                                    console.log(`${prefix} doubles: ${dataRankings[2][1]}`);
                                    array[2].push(dataRankings[2][1]);
                                    return array
                                }
                                else{
                                    throw "No available data"
                                }
                            } 
                            catch (error) {
                                console.error(`Failed to fetch data for ${prefix}:`, error.name);
                                await new Promise(resolve => setTimeout(resolve, 1000));
                            }
                        }
                        
                        if (array[1].length === 0 && array[2].length === 0) {
                            console.log("No data found");
                        }
                    }
                }
            }
        } else {
            console.log('No available player data');
        }
    }
    else{
        console.log("No available data")
    }
    
    return array;
}

// let profileNameITF = 'juan carlos portilla morales'
// GetPlayerInfoITF(profileNameITF, "JT").then(output => {
//     console.log(output)
// });


// Find UTR for player by matching existing ITF
async function GetPlayerInfoUTRmatchingITF(profileName, ITFID){
    let tempArr = profileName.split(" ");
    let urlName = "";
    for (let i = 0; i < tempArr.length; i++){
        urlName = urlName + tempArr[i].toLowerCase() + "+";
    }
    urlName = urlName.substring(0,urlName.length-1);

    const agent = new HttpsProxyAgent(proxyUrl)

    let profileQueryUrlUTR = "https://api.utrsports.net/v2/search?schoolClubSearch=true&query=" + urlName + "&top=10&skip=0";

    const optionsProfileQueryUTR = {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-US,en;q=0.9",
            "sec-ch-ua": "\"Google Chrome\";v=\"123\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "x-client-name": "buildId - 66730",
            "Referer": "https://app.utrsports.net/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET",
        "agent": agent
    };
    
    async function fetchData() {
        try {
            const response = await fetch(profileQueryUrlUTR, optionsProfileQueryUTR);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;  // Return the JSON object directly
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
            return null;  // Return null in case of an error
        }
    }

    var array = [["Full Name"],["Singles Rating"],["Doubles Rating"],["ID"]];

    console.log("Starting to get UTR information")

    let data = await fetchData();
    if (data.players.hits.length > 0) {
        for(let i = 0; i < data.players.hits.length; i++){
            if(data.players.hits[i].source.displayName.toLowerCase() == profileName.toLowerCase()){
                let flag = await checkHistoriesITFUTR(ITFID, data.players.hits[i].id)
                if(flag == true){
                    console.log("Match Found")
                    array[0].push(data.players.hits[i].source.displayName);
                    array[1].push(data.players.hits[i].source.singlesUtr);
                    array[2].push(data.players.hits[i].source.doublesUtr);
                    array[3].push(data.players.hits[i].id);
                    return array
                }
            }
        }
    } else {
        console.log('No available data');
    }
    return array;
}

// let profileNameUTR = 'juan carlos portilla morales'
// GetPlayerInfoUTR(profileNameUTR).then(output => {
//     console.log(output);
// });

// Fetch profile for ITF ranking which matches UTR
async function GetPlayerInfoITFmatchingUTR(profileName, UTRID){
    let tempArr = profileName.split(" ");
    let urlName = "";
    for (let i = 0; i < tempArr.length; i++){
        urlName = urlName + tempArr[i].toLowerCase() + "%20";
    }
    urlName = urlName.substring(0,urlName.length-3);

    const agent = new HttpsProxyAgent(proxyUrl)

    let profileQueryUrlITF = "https://www.itftennis.com/tennis/api/SearchApi/Search?searchString=" + urlName;

    const optionsProfileQueryITF = {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "if-none-match": "\"db190aaa-e10b-489a-b6be-186123606aff\"",
            "sec-ch-ua": "\"Google Chrome\";v=\"123\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "no-cors",
            "sec-fetch-site": "same-origin",
            "cookie": "ARRAffinity=1a7aff82bc21373b03d8fda86d009014a254fb43661cd4068b45b28f7aa56160; ARRAffinitySameSite=1a7aff82bc21373b03d8fda86d009014a254fb43661cd4068b45b28f7aa56160; nlbi_178373=WoOlfcKrUX74IcPrtoSRdQAAAAC1EQcYItmH4KWM3N+uQ9TB; visid_incap_178373=Dn8i34OrQ9Ou+Uaqt/HTRZfqQ2YAAAAAQUIPAAAAAADSBShpC3aFKHHfoEmA2SwV; OptanonAlertBoxClosed=2024-05-14T22:50:49.470Z; incap_ses_182_178373=JI+yDui8C3Wgj9VwIJiGAn6VcGYAAAAAHoJCM/aqgDhxq/cqUGR9Ew==; OptanonConsent=isGpcEnabled=0&datestamp=Mon+Jun+17+2024+15%3A59%3A42+GMT-0400+(Eastern+Daylight+Time)&version=6.23.0&isIABGlobal=false&hosts=&consentId=825ca760-103e-4af0-ac75-9af72d02f2a9&interactionCount=1&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1%2CC0005%3A1&geolocation=US%3BNJ&AwaitingReconsent=false"
        },
        "referrerPolicy": "no-referrer",
        "body": null,
        "method": "GET"
    };

    async function fetchWithRetry(url, options, retries = 3, backoff = 1000) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } 
        catch (error) {
            if (retries > 0) {
                console.error(`Fetch failed: ${error.message}. Retrying in ${backoff}ms...`);
                await new Promise(resolve => setTimeout(resolve, backoff));
                return fetchWithRetry(url, options, retries - 1, backoff * 2);
            } 
            else {
                console.error(`Fetch failed after ${retries} retries: ${error.message}`);
                await new Promise(resolve => setTimeout(resolve, backoff)); // Delay after final failure
                throw error;
            }
        }
    }

    var array = [["Full Name"],["Singles Rating"],["Doubles Rating"],["ID"]];

    let data = await fetchWithRetry(profileQueryUrlITF, optionsProfileQueryITF);
    
    console.log("Starting GetPlayerInfoITF")
    console.log(data)
    if(data){
        if (data.players.length > 0) {
            for(let integer = 0; integer < data.players.length; integer++){
                let flag = await checkHistoriesITFUTR(data.players[integer].playerId, UTRID)
                if(flag == true){
                    let Id = data.players[integer].playerId;
                    let prefixes = ["JT", "MT", "FT", "VT", "WCT", "BT"]
                    for (const prefix of prefixes) {
                        try {
                            let dataRankings = await GetPlayerInfoITFID(prefix, Id);
                            if (dataRankings[1].length > 1 || dataRankings[2].length > 1) {
                                console.log(`${prefix} singles: ${dataRankings[1][1]}`);
                                array[1].push(dataRankings[1][1]);
                                console.log(`${prefix} doubles: ${dataRankings[2][1]}`);
                                array[2].push(dataRankings[2][1]);
                                return array
                            }
                            else{
                                throw "No available data"
                            }
                        } 
                        catch (error) {
                            console.error(`Failed to fetch data for ${prefix}:`, error.name);
                            await sleep(10000);
                        }
                    }
                        
                    if (array[1].length === 0 && array[2].length === 0) {
                        console.log("No data found");
                    }
                    
                }
            }
        } else {
            console.log('No available player data');
        }
    }
    else{
        console.log("No available data")
    }
    
    return array;
}

async function GetPlayerInfoUSTAmatchingUTR(profileName, UTRID){
    //Fetch info for players with matching full name and then verify with UTR play history
}

async function GetPlayerInfoUTRmatchingUSTA(profileName, USTAID){
    //Fetch info for players with matching full name and then verify with USTA play history
}

// Get ITF player info by ID
async function GetPlayerInfoITFID(circuitCode,ID){
    const agent = new HttpsProxyAgent(proxyUrl)
    let singlesURL = "https://www.itftennis.com/tennis/api/PlayerApi/GetPlayerOverview?circuitCode=" + circuitCode + "&matchTypeCode=S&playerId=" + ID;
    let doublesURL = "https://www.itftennis.com/tennis/api/PlayerApi/GetPlayerOverview?circuitCode=" + circuitCode + "&matchTypeCode=D&playerId=" + ID;
    
    let options = {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "sec-ch-ua": "\"Google Chrome\";v=\"123\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
        },
        "referrerPolicy": "no-referrer",
        "body": null,
        "method": "GET"
    };

    async function fetchData(URL, opt) {
        try {
            const response = await fetch(URL, opt);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;  // Return the JSON object directly
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
            return null;  // Return null in case of an error
        }
    }

    var array = [["Full Name"],["Singles Rating"],["Doubles Rating"]];

    let dataSingle = await fetchData(singlesURL, options)

    if(dataSingle){
        if (dataSingle.rankings[0]) {
            array[1].push(dataSingle.rankings[0].rank);
        } else {
            console.log('No available data');
        }
    }
    else{
        console.log("No available player data")
    }
    
    let dataDouble = await fetchData(doublesURL, options);
    if(dataDouble){
        if (dataDouble.rankings[0]) {
            array[2].push(dataDouble.rankings[0].rank);
        } else {
            console.log('No available player data');
        }
    }
    else{
        console.log("No available doubles data")
    }

    return array;
}

// let ID = "800598540";
// let circuitCode = "JT"
// GetPlayerInfoITFID(circuitCode, ID).then(output => {
//     console.log(output);
// })

// Fetch profile for UTR and name
async function GetPlayerUTRbyID(ID){
    const agent = new HttpsProxyAgent(proxyUrl)
    let urlProfileInfo = "https://api.utrsports.net/v1/player/" + ID + "/profile";

    const optionsProfile = {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-US,en;q=0.9",
            "newrelic": "eyJ2IjpbMCwxXSwiZCI6eyJ0eSI6IkJyb3dzZXIiLCJhYyI6IjMwMjgxMjMiLCJhcCI6IjUzOTYzMzgzOCIsImlkIjoiODUwMmE0MDRiNWM0YjhlZSIsInRyIjoiMTM5NWQ3YmRjZTRiMTJlNTFlNzI5NzY5YWY3ZGRmZjAiLCJ0aSI6MTcxODEzNzE2NTY0OH19",
            "sec-ch-ua": "\"Google Chrome\";v=\"123\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "x-client-name": "buildId - 67071",
            "Referer": "https://app.utrsports.net/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET",
        "agent": agent
    };
    
    async function fetchData() {
        try {
            const response = await fetch(urlProfileInfo, optionsProfile);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;  // Return the JSON object directly
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
            return null;  // Return null in case of an error
        }
    }

    var array = [["Full Name"],["Singles Rating"],["Doubles Rating"]];

    let data = await fetchData()
    
    if (data) {
        array[0].push(data.displayName);
        array[1].push(data.singlesUtr);
        array[2].push(data.doublesUtr);
    } else {
        console.log('No available data');
    }
    
    return array;
}

// let profileID = '2802438';
// GetPlayerUTRbyID(profileID).then(output => {
//     console.log(output);
// })