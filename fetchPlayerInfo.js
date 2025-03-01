// Import the node-fetch package
import fetch from 'node-fetch';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { BlobServiceClient } from '@azure/storage-blob';

// Define Proxy URL
const proxyUrl = 'http://brd-customer-hl_11c67c82-zone-datacenter_proxy1:3z2eyhs8iq9h@brd.superproxy.io:33335';

// Replace with your Azure Storage account connection string

const CONTAINER_NAME = "databases";
const BLOB_NAME = "players_database.json"; // Replace with your JSON file name

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//General function to update each entry in players database
export async function updateDatabaseEntriesPlayers(){
    let database = await loadDatabasePlayers()

    for(let i = 0; i < database.length; i++){
        //["Full Name","UTR ID","ITF ID","UTR Singles Rating","UTR Doubles Rating","ITF Singles Rating","ITF Doubles Rating","Flags"]
        
        if(database[i][10].includes("No UTR Data") != true){
            //Check if UTR ID is added
            if(database[i][1] != "NA"){
                // If added, update player values
                let UTRData = await GetPlayerUTRbyID(database[i][1])
                if(UTRData[1].length > 1 && UTRData[2].length > 1){
                    database[i][3] = UTRData[1][1]
                    database[i][4] = UTRData[2][1]
                }
                // If no data is found with ID, remove ID and add flag
                else{
                    database[i][7].push("No UTR Data")
                    database[i][1] = "NA"
                    database[i][3] = 0
                    database[i][4] = 0
                }
            }
            // Otherwise update flags
            else{
                database[i][10].push("No UTR Data")
            }
        }

        if(database[i][10].includes("No ITF Data") != true){
            //Check if ITF ID is added
            if(database[i][2] != "NA"){
                // If added, update player values
                let ITFData = "NA"
                let circuitCodes = ["JT", "MT", "WT", "VT", "WCT", "BT"]
                for(circCode in circuitCodes){
                    ITFData = await GetPlayerInfoITFID(circCode, database[i][2])
                    if(ITFData[1].length > 1){
                        database[i][5] = ITFData[1][1]
                    }
                    if(ITFData[2].length > 1){
                        database[i][6] = ITFData[2][1]
                    }
                }
                // If no data is found with ID, remove ID and add flag
                if(ITFData == "NA"){
                    database[i][7].push("No ITF Data")
                    database[i][2] = "NA"
                    database[i][5] = 0
                    database[i][6] = 0
                }
            }
            // Otherwise update flags
            else{
                database[i][7].push("No ITF Data")
            }
        }
    }
    await saveDatabasePlayers(database)
}

// Function to read a JSON file from Azure Blob Storage
async function loadDatabasePlayers() {
    try {
        const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
        const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
        const blobClient = containerClient.getBlobClient(BLOB_NAME);

        console.log(`Reading blob: ${BLOB_NAME}`);

        // Download the blob's content
        const downloadBlockBlobResponse = await blobClient.download(0);
        const downloadedContent = await streamToString(downloadBlockBlobResponse.readableStreamBody);

        // Return the parsed JSON content
        return JSON.parse(downloadedContent);
    } catch (error) {
        console.error(`Error reading blob ${BLOB_NAME}:`, error.message);
        return ["Full Name","UTR ID","ITF ID","UTR Singles Rating","UTR Doubles Rating","ITF Singles Rating","ITF Doubles Rating","Flags"];
    }
}

async function saveDatabasePlayers(jsonData) {
    try {
        // Create a BlobServiceClient
        const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

        // Get a container client
        const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

        // Ensure the container exists
        await containerClient.createIfNotExists();
        console.log(`Container '${CONTAINER_NAME}' is ready.`);

        // Get a block blob client
        const blockBlobClient = containerClient.getBlockBlobClient(BLOB_NAME);

        // Convert JSON data to string
        const jsonString = JSON.stringify(jsonData, null, 2);

        // Upload the JSON string to the blob
        const uploadResponse = await blockBlobClient.upload(jsonString, jsonString.length);
        console.log(`Blob '${BLOB_NAME}' uploaded successfully.`, uploadResponse);
    } catch (error) {
        console.error("Error writing JSON to blob:", error);
    }
}

// Helper function to read a stream into a string
async function streamToString(readableStream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        readableStream.on("data", (data) => chunks.push(data.toString()));
        readableStream.on("end", () => resolve(chunks.join("")));
        readableStream.on("error", reject);
    });
}

// Function to check and update the database when encountering UTR player
export async function checkAndUpdateDatabasePlayersUTR(Name, UTRID) {
    let database = await loadDatabasePlayers()

    // Find the index of the row that contains the UTRID
    let rowIndex = database.findIndex(row => row[1] === UTRID);

    let array = [["UTR Singles Rating"], ["UTR Doubles Rating"], ["ITF Singles Rating"], ["ITF Doubles Rating"]]

    console.log("Starting database checking and update")
    console.log(rowIndex)
    if (rowIndex !== -1) {
        // Access data from existing row
        let existingRow = database[rowIndex];
        array[0].push(existingRow[3])
        array[1].push(existingRow[4])
        array[2].push(existingRow[5])
        array[3].push(existingRow[6])
    } else {
        // If the ID does not exist, append a new row with the name and ID
        let UTRDataOut = await GetPlayerUTRbyID(UTRID)

        //Temporary values
        let item = [Name, UTRID, "NA", "NA", 0, 0, 0, 0, 0, 0, []]
        array[0].push(0)
        array[1].push(0)
        array[2].push(0)
        array[3].push(0)
        dataFound = false;

        if (UTRDataOut[0].length > 1 && UTRDataOut[0][1] == Name) {
            // Get information from UTR
            // Check if UTR data exists, then update array
            if(UTRDataOut[1].length > 1 && UTRDataOut[2].length > 1){
                array[0][1] = UTRDataOut[1][1]
                array[1][1] = UTRDataOut[2][1]
            }

            // Get information from ITF
            let ITFDataOut = await GetPlayerInfoITFmatchingUTR(Name, UTRID)
            // Check if ITF Data exists, then update array
            if(ITFDataOut[1].length > 1 && ITFDataOut[2].length > 1 && ITFDataOut[3].length > 1){
                ITFIDOut = ITFDataOut[3][1]
                array[2][1] = ITFDataOut[1][1]
                array[3][1] = ITFDataOut[2][1]

                //Check to see if database entry for player already exists with ITF and no UTR
                let ITFrowIndex = database.findIndex(row => row[2] === ITFIDOut)

                //If entry exists, update UTR info and remove no UTR data flag
                if(ITFrowIndex !== -1){
                    dataFound = true
                    database[ITFrowIndex][1] = UTRID
                    database[ITFrowIndex][3] = array[0][1]
                    database[ITFrowIndex][4] = array[1][1]

                    //Remove no UTR data flag
                    if(array[0][1] !== 0 && array[1][1] !== 0){
                        for(let tempIndex = 0; tempIndex < database[ITFrowIndex][10].length; tempIndex++){
                            if(database[ITFrowIndex][7][tempIndex] == "No UTR Data"){
                                database[ITFrowIndex][7].splice(tempIndex, 1)
                            }
                        }
                    }
                }
                //Otherwise create new entry and push to database
                else{
                    item[3] = array[0][1]
                    item[4] = array[1][1]
                    item[5] = array[2][1]
                    item[6] = array[3][1]
                    item[2] = ITFIDOut
                }
            }
            //If no ITF data, update item and add flag
            else{
                item[7].push("No ITF Data")
                item[5] = array[2][1]
                item[6] = array[3][1]
            }
        }
        //If no UTR data, update item and push to database with appropriate flag
        else{
            item[7].push("No UTR Data")
            item[7].push("No ITF Data")
            item[3] = array[0][1]
            item[4] = array[1][1]
            item[5] = array[2][1]
            item[6] = array[3][1]
            database.push(item)
        }
    }
    await saveDatabasePlayers(database)
    console.log("Finished checking and updating database")
    return array
}

// Function to check and update the database when encountering ITF player
export async function checkAndUpdateDatabasePlayersITF(Name, ITFID) {
    let database = await loadDatabasePlayers()

    // Find the index of the row that contains the UTRID
    let rowIndex = database.findIndex(row => row[2] === ITFID);

    let array = [["UTR Singles Rating"], ["UTR Doubles Rating"], ["ITF Singles Rating"], ["ITF Doubles Rating"]]
    console.log("Starting database checking and update")
    if (rowIndex !== -1) {
        // Access data from existing row
        let existingRow = database[rowIndex];
        array[0].push(existingRow[3])
        array[1].push(existingRow[4])
        array[2].push(existingRow[5])
        array[3].push(existingRow[6])
    } else {
        // If the ID does not exist, append a new row with the name and ID
        let ITFDataOut = await GetPlayerInfoITFID(ITFID);

        //Initialize objects
        let item = [Name, "NA", ITFID, 0, 0, 0, 0, []]
        array[0].push(0)
        array[1].push(0)
        array[2].push(0)
        array[3].push(0)

        if(ITFDataOut[1].length > 1 && ITFDataOut[2].length > 1){
            // Add information from ITF if it exists
            array[2][1] = ITFDataOut[1][1]
            array[3][1] = ITFDataOut[2][1]

            // Add information from UTR
            console.log("Starting to find UTR with matching ITF")
            let UTRDataOut = await GetPlayerInfoUTRmatchingITF(Name, ITFID)

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
                    item[3] = array[0][1]
                    item[4] = array[1][1]
                    item[5] = array[2][1]
                    item[6] = array[3][1]
                    item[1] = UTRIDOut
                    database.push(item)
                }
            }
            // Add flag if UTR data doesn't exist
            else{
                item[7].push("No UTR Data")
                item[3] = array[0][1]
                item[4] = array[1][1]
                item[5] = array[2][1]
                item[6] = array[3][1]
                database.push(item)
            }
        }

        //If no ITF data, update flags
        else{
            item[7].push("No UTR Data")
            item[7].push("No ITF Data")
            item[3] = array[0][1]
            item[4] = array[1][1]
            item[5] = array[2][1]
            item[6] = array[3][1]
            database.push(item)
        }
    }
    await saveDatabasePlayers(database)
    console.log("Finished checking and updating database")
    return array
}

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
        "method": "GET",
        "agent": agent
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
                                array[1].push(dataRankings[1][1]);
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

function splitFullName(fullName) {
    // Trim any extra spaces at the beginning or end
    fullName = fullName.trim();
    
    // Split the name into parts based on spaces
    const nameParts = fullName.split(/\s+/);
    
    // Extract the first name (first part) and last name (last part)
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" "); // Handles middle names if present
    
    return { firstName, lastName };
}

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
        "agent": agent
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