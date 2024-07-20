// Import the node-fetch package
import { TIMEOUT } from 'dns';
import fetch from 'node-fetch';
import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

// Define the path to the file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const path = `${__dirname}/players_database.json`;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const saveData = async (jsonData) => {
    try {
        const dataPath = `${__dirname}/data.json`
        const dataString = JSON.stringify(jsonData, null, 2); // Convert JSON to string with indentation
        await fs.promises.writeFile(dataPath, dataString, { encoding: 'utf8' });
        console.log('Data saved successfully.');
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

const loadData = async () => {
    try {
        const dataPath = `${__dirname}/data.json`
        const dataString = await fs.promises.readFile(dataPath, { encoding: 'utf8' });
        const jsonData = JSON.parse(dataString); // Convert string to JSON
        console.log('Data loaded successfully:');
        return jsonData;
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

async function checkHistories(ITFID, UTRID){
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
        "method": "GET"
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
                "sec-fetch-site": "same-origin",
                "cookie": "ARRAffinity=1a7aff82bc21373b03d8fda86d009014a254fb43661cd4068b45b28f7aa56160; ARRAffinitySameSite=1a7aff82bc21373b03d8fda86d009014a254fb43661cd4068b45b28f7aa56160; visid_incap_178373=Dn8i34OrQ9Ou+Uaqt/HTRZfqQ2YAAAAAQUIPAAAAAADSBShpC3aFKHHfoEmA2SwV; OptanonAlertBoxClosed=2024-05-14T22:50:49.470Z; nlbi_178373=z9oocS6G6ktUjC5jtoSRdQAAAACEW5fM19ne/+k4ySv0KwEY; incap_ses_182_178373=2cu4CbpIZB2O4G8bJZiGAoThlmYAAAAAWXV1pFOd+KnP3Dou64IP6Q==; OptanonConsent=isGpcEnabled=0&datestamp=Tue+Jul+16+2024+17%3A09%3A29+GMT-0400+(Eastern+Daylight+Time)&version=6.23.0&isIABGlobal=false&hosts=&consentId=825ca760-103e-4af0-ac75-9af72d02f2a9&interactionCount=1&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1%2CC0005%3A1&geolocation=US%3BNJ&AwaitingReconsent=false"
            },
            "referrerPolicy": "no-referrer",
            "body": null,
            "method": "GET"
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
    let flag = false
    let ITFData = "N/A"
    let i = 0
    console.log("Starting to get ITF data for history verification")
    while(flag == false && i < circCodes.length){
        await sleep(5000)
        console.log(circCodes[i])
        ITFData = await fetchDataITF(circCodes[i])
        if(ITFData.totalItems > 0){
            flag = true
        }
        else{
            i++
        }
    }
    console.log("Starting to get UTR data for history verification")
    let UTRData = await fetchDataUTR()
    await sleep(5000)

    console.log("Recieved ITF and UTR data")

    let count = 0
    for(let i = 0; i < UTRData.events.length; i++){
        for(let j = 0; j < ITFData.items.length; j++){
            if(UTRData.events[i].name == ITFData.items[j].tournamentName){
                count++
            }
        }
    }
    console.log("Matches: " + count)

    let perc = count/ITFData.items.length
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
    return ["Full Name","UTR ID","ITF ID","USTA ID","UTR Singles Rating","UTR Doubles Rating","ITF Singles Rating","ITF Doubles Rating"];
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
export async function checkAndUpdateDatabasePlayersUTR(Name, UTRID) {
    let database = await loadDatabasePlayers()

    // Find the index of the row that contains the UTRID
    let rowIndex = database.findIndex(row => row[1] === UTRID);

    let array = [["UTR Singles Rating"], ["UTR Doubles Rating"], ["ITF Singles Rating"], ["ITF Doubles Rating"]]

    console.log("Starting database checking and update")
    console.log(rowIndex)
    // If the ID exists, update the row
    if (rowIndex !== -1) {
        // You can access and update the existing row using rowIndex
        let existingRow = database[rowIndex];
        array[0].push(existingRow[4])
        array[1].push(existingRow[5])
        array[2].push(existingRow[6])
        array[3].push(existingRow[7])
    } else {
        // If the ID does not exist, append a new row with the name and ID
        let UTRDataOut = await GetPlayerUTRbyID(UTRID)
        console.log(Name)
        console.log(UTRDataOut[0][1])
        if (UTRDataOut[0][1] == Name) {
            console.log("Inner check reached")
            // Initiate row object
            let item = [Name, UTRID, "NA", "NA", "NA", "NA", "NA", "NA"]

            // Get information from UTR
            console.log("UTR Data Out")
            console.log(UTRDataOut)
            item[4] = UTRDataOut[1][1];
            item[5] = UTRDataOut[2][1];
            array[0].push(UTRDataOut[1][1])
            array[1].push(UTRDataOut[2][1])

            // Get information from ITF
            console.log("Starting to find ITF with matching UTR")
            let ITFDataOut = await GetPlayerInfoITFmatchingUTR(Name, UTRID)
            console.log("ITF Data Out")
            console.log(ITFDataOut)
            item[2] = ITFDataOut[3][1]
            item[6] = ITFDataOut[1][1]
            item[7] = ITFDataOut[2][1]
            array[2].push(ITFDataOut[1][1])
            array[3].push(ITFDataOut[2][1])

            // Push row object to database
            // database.push(item);
        }
    }
    await saveDatabasePlayers(database)
    console.log("Finished checking and updating database")
    return array
}

export async function checkAndUpdateDatabasePlayersITF(Name, ITFID) {
    let database = await loadDatabasePlayers()

    // Find the index of the row that contains the UTRID
    let rowIndex = database.findIndex(row => row[1] === ITFID);

    let array = [["UTR Singles Rating"], ["UTR Doubles Rating"], ["ITF Singles Rating"], ["ITF Doubles Rating"]]
    console.log("Starting database checking and update")
    // If the ID exists, update the row
    if (rowIndex !== -1) {
        // You can access and update the existing row using rowIndex
        let existingRow = database[rowIndex];
        array[0].push(existingRow[4])
        array[1].push(existingRow[5])
        array[2].push(existingRow[6])
        array[3].push(existingRow[7])
    } else {
        // If the ID does not exist, append a new row with the name and ID
        let ITFDataOut = await GetPlayerInfoITFID(ITFID);
        if (ITFDataOut[0] === Name) {
            let item = [Name, "NA", ITFID, "NA", "NA", "NA", "NA", "NA"];

            // Add information from ITF
            item[6] = ITFDataOut[1][1]
            item[7] = ITFDataOut[2][1]
            array[2].push(ITFDataOut[1][1])
            array[3].push(ITFDataOut[2][1])

            // Add information from UTR
            let UTRDataOut = await GetPlayerInfoUTRmatchingITF(Name, ITFID)
            item[1] = UTRDataOut[3][1]
            item[4] = UTRDataOut[1][1]
            item[5] = UTRDataOut[2][1]
            array[0].push(UTRDataOut[1][1])
            array[1].push(UTRDataOut[2][1])

            // Push row object to database
            database.push(item);
        }
    }
    await saveDatabasePlayers(database)
    console.log("Finished checking and updating database")
    return array
}

// Find UTR for player
async function GetPlayerInfoUTR(profileName){
    let tempArr = profileName.split(" ");
    let urlName = "";
    for (let i = 0; i < tempArr.length; i++){
        urlName = urlName + tempArr[i].toLowerCase() + "+";
    }
    urlName = urlName.substring(0,urlName.length-1);

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
            "cookie": "OptanonAlertBoxClosed=2024-05-14T22:49:17.156Z; ut_user_info=SubscriptionType%3DFree%26MemberId%3D1364082%26Email%3D7nk6f7fy22%40privaterelay.appleid.com; _cmp_a=%7B%22purposes%22%3A%7B%22a%22%3Atrue%2C%22p%22%3Atrue%2C%22m%22%3Atrue%2C%22t%22%3Atrue%7D%2C%22display_banner%22%3Afalse%2C%22sale_of_data_region%22%3Afalse%7D; _shopify_y=4a6c3b27-7497-4d05-aa3c-ba9f7c80581a; _landing_page=%2F; _tracking_consent=%7B%22con%22%3A%7B%22CMP%22%3A%7B%22a%22%3A%221%22%2C%22m%22%3A%221%22%2C%22p%22%3A%221%22%2C%22s%22%3A%22%22%7D%7D%2C%22v%22%3A%222.1%22%2C%22region%22%3A%22USNJ%22%2C%22reg%22%3A%22%22%7D; jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNZW1iZXJJZCI6IjEzNjQwODIiLCJlbWFpbCI6IjduazZmN2Z5MjJAcHJpdmF0ZXJlbGF5LmFwcGxlaWQuY29tIiwiVmVyc2lvbiI6IjEiLCJEZXZpY2VMb2dpbklkIjoiMTk5MjgyNTgiLCJuYmYiOjE3MTgxMzc3NjEsImV4cCI6MTcyMDcyOTc2MSwiaWF0IjoxNzE4MTM3NzYxfQ.JCml_3Nv-fWqqxPTClNwGximgEdX7Z4dTU4ZpwArsZA; _shopify_s=115deb84-8F5B-4503-229F-D4E91814764D; _shopify_sa_t=2024-06-13T11%3A31%3A25.597Z; _shopify_sa_p=; OptanonConsent=isGpcEnabled=0&datestamp=Thu+Jun+13+2024+07%3A31%3A25+GMT-0400+(Eastern+Daylight+Time)&version=202311.1.0&browserGpcFlag=0&isIABGlobal=false&hosts=&consentId=1c1cab54-eb20-42b8-adff-b017daddbd1c&interactionCount=1&landingPath=NotLandingPage&groups=C0002%3A1%2CC0001%3A1%2CC0004%3A1%2CC0003%3A1&geolocation=US%3BNJ&AwaitingReconsent=false; _orig_referrer=",
            "Referer": "https://app.utrsports.net/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
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
// GetPlayerInfoUTR(profileNameUTR).then(output => {
//     console.log(output);
// });

// Fetch profile for ITF ranking
async function GetPlayerInfoITF(profileName, tournCircuitCode){
    let tempArr = profileName.split(" ");
    let urlName = "";
    for (let i = 0; i < tempArr.length; i++){
        urlName = urlName + tempArr[i].toLowerCase() + "%20";
    }
    urlName = urlName.substring(0,urlName.length-3);

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
    if(data){
        if (data.players.length > 0) {
            for(let integer = 0; integer < data.players.length; integer++){
                console.log("Player: ")
                console.log(data.players[integer])
                for(let index = 0; index < data.players[integer].playedCircuits.length; index++){
                    console.log(data.players[integer].playedCircuits[index].value)
                    console.log(tournCircuitCode)
                    if(data.players[integer].playedCircuits[index].value == tournCircuitCode){
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
// GetPlayerInfoITF(profileNameITF).then(output => {
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
            "cookie": "OptanonAlertBoxClosed=2024-05-14T22:49:17.156Z; ut_user_info=SubscriptionType%3DFree%26MemberId%3D1364082%26Email%3D7nk6f7fy22%40privaterelay.appleid.com; _cmp_a=%7B%22purposes%22%3A%7B%22a%22%3Atrue%2C%22p%22%3Atrue%2C%22m%22%3Atrue%2C%22t%22%3Atrue%7D%2C%22display_banner%22%3Afalse%2C%22sale_of_data_region%22%3Afalse%7D; _shopify_y=4a6c3b27-7497-4d05-aa3c-ba9f7c80581a; _landing_page=%2F; _tracking_consent=%7B%22con%22%3A%7B%22CMP%22%3A%7B%22a%22%3A%221%22%2C%22m%22%3A%221%22%2C%22p%22%3A%221%22%2C%22s%22%3A%22%22%7D%7D%2C%22v%22%3A%222.1%22%2C%22region%22%3A%22USNJ%22%2C%22reg%22%3A%22%22%7D; jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNZW1iZXJJZCI6IjEzNjQwODIiLCJlbWFpbCI6IjduazZmN2Z5MjJAcHJpdmF0ZXJlbGF5LmFwcGxlaWQuY29tIiwiVmVyc2lvbiI6IjEiLCJEZXZpY2VMb2dpbklkIjoiMTk5MjgyNTgiLCJuYmYiOjE3MTgxMzc3NjEsImV4cCI6MTcyMDcyOTc2MSwiaWF0IjoxNzE4MTM3NzYxfQ.JCml_3Nv-fWqqxPTClNwGximgEdX7Z4dTU4ZpwArsZA; _shopify_s=115deb84-8F5B-4503-229F-D4E91814764D; _shopify_sa_t=2024-06-13T11%3A31%3A25.597Z; _shopify_sa_p=; OptanonConsent=isGpcEnabled=0&datestamp=Thu+Jun+13+2024+07%3A31%3A25+GMT-0400+(Eastern+Daylight+Time)&version=202311.1.0&browserGpcFlag=0&isIABGlobal=false&hosts=&consentId=1c1cab54-eb20-42b8-adff-b017daddbd1c&interactionCount=1&landingPath=NotLandingPage&groups=C0002%3A1%2CC0001%3A1%2CC0004%3A1%2CC0003%3A1&geolocation=US%3BNJ&AwaitingReconsent=false; _orig_referrer=",
            "Referer": "https://app.utrsports.net/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
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
                let flag = await checkHistories(ITFID, data.players.hits[i].id)
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
                let flag = await checkHistories(data.players[integer].playerId, UTRID)
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

// Get ITF player info by ID
async function GetPlayerInfoITFID(circuitCode,ID){
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
            "cookie": "ARRAffinity=1a7aff82bc21373b03d8fda86d009014a254fb43661cd4068b45b28f7aa56160; ARRAffinitySameSite=1a7aff82bc21373b03d8fda86d009014a254fb43661cd4068b45b28f7aa56160; nlbi_178373=WoOlfcKrUX74IcPrtoSRdQAAAAC1EQcYItmH4KWM3N+uQ9TB; visid_incap_178373=Dn8i34OrQ9Ou+Uaqt/HTRZfqQ2YAAAAAQUIPAAAAAADSBShpC3aFKHHfoEmA2SwV; OptanonAlertBoxClosed=2024-05-14T22:50:49.470Z; incap_ses_182_178373=JI+yDui8C3Wgj9VwIJiGAn6VcGYAAAAAHoJCM/aqgDhxq/cqUGR9Ew==; OptanonConsent=isGpcEnabled=0&datestamp=Mon+Jun+17+2024+16%3A21%3A30+GMT-0400+(Eastern+Daylight+Time)&version=6.23.0&isIABGlobal=false&hosts=&consentId=825ca760-103e-4af0-ac75-9af72d02f2a9&interactionCount=1&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1%2CC0005%3A1&geolocation=US%3BNJ&AwaitingReconsent=false"
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

    var array = [["Full Name"],["Singles Rating"],["Doubles Rating"],["ID"]];

    console.log("Starting GetPlayerInfoITFID for Singles")
    let dataSingle = await fetchData(singlesURL, options)

    if(dataSingle){
        console.log(dataSingle.rankings)
        if (dataSingle.rankings[0]) {
            console.log(dataSingle.rankings[0]);
            array[1].push(dataSingle.rankings[0].rank);
        } else {
            console.log('No available data');
        }
    }
    else{
        console.log("No available player data")
    }
    

    console.log("Starting GetPlayerInfoITFID for Doubles")
    let dataDouble = await fetchData(doublesURL, options);
    console.log("Finished retrieving Doubles data")
    console.log(dataDouble)
    if(dataDouble){
        if (dataDouble.rankings[0]) {
            console.log(dataDouble.rankings[0]);
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
// GetPlayerInfoITFID(ID).then(output => {
//     console.log(output);
// })

// Fetch profile for UTR and name
async function GetPlayerUTRbyID(ID){
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
            "cookie": "OptanonAlertBoxClosed=2024-05-14T22:49:17.156Z; jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNZW1iZXJJZCI6IjEzNjQwODIiLCJlbWFpbCI6IjduazZmN2Z5MjJAcHJpdmF0ZXJlbGF5LmFwcGxlaWQuY29tIiwiVmVyc2lvbiI6IjEiLCJEZXZpY2VMb2dpbklkIjoiMTk1OTUwNDEiLCJuYmYiOjE3MTU3MjY5OTYsImV4cCI6MTcxODMxODk5NiwiaWF0IjoxNzE1NzI2OTk2fQ.wzu7z83_1WmhZbvPbaG7a5hAlKw2jK5ZefeUrvbL7vo; ut_user_info=SubscriptionType%3DFree%26MemberId%3D1364082%26Email%3D7nk6f7fy22%40privaterelay.appleid.com; _cmp_a=%7B%22purposes%22%3A%7B%22a%22%3Atrue%2C%22p%22%3Atrue%2C%22m%22%3Atrue%2C%22t%22%3Atrue%7D%2C%22display_banner%22%3Afalse%2C%22sale_of_data_region%22%3Afalse%7D; _shopify_y=4a6c3b27-7497-4d05-aa3c-ba9f7c80581a; _landing_page=%2F; _tracking_consent=%7B%22con%22%3A%7B%22CMP%22%3A%7B%22a%22%3A%221%22%2C%22m%22%3A%221%22%2C%22p%22%3A%221%22%2C%22s%22%3A%22%22%7D%7D%2C%22v%22%3A%222.1%22%2C%22region%22%3A%22USNJ%22%2C%22reg%22%3A%22%22%7D; _orig_referrer=; OptanonConsent=isGpcEnabled=0&datestamp=Tue+Jun+11+2024+16%3A19%3A22+GMT-0400+(Eastern+Daylight+Time)&version=202311.1.0&browserGpcFlag=0&isIABGlobal=false&hosts=&consentId=1c1cab54-eb20-42b8-adff-b017daddbd1c&interactionCount=1&landingPath=NotLandingPage&groups=C0002%3A1%2CC0001%3A1%2CC0004%3A1%2CC0003%3A1&geolocation=US%3BNJ&AwaitingReconsent=false",
            "Referer": "https://app.utrsports.net/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
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