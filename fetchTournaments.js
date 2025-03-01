// Import the node-fetch package
import fetch from 'node-fetch';
import { HttpsProxyAgent } from 'https-proxy-agent'
import { checkAndUpdateDatabasePlayersUTR, checkAndUpdateDatabasePlayersITF} from './fetchPlayerInfo.js';
import { BlobServiceClient } from '@azure/storage-blob';

// Replace with your Azure Storage account connection string

const CONTAINER_NAME = "databases";
const BLOB_NAME = "tournaments_database.json"; // Replace with your JSON file name

// Define Proxy URL
const proxyUrl = 'http://brd-customer-hl_11c67c82-zone-datacenter_proxy1:3z2eyhs8iq9h@brd.superproxy.io:33335';

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    const shortYear = String(year).slice(-2);
    
    return {
      "UTR": `${month}/${day}/${year}`,
      "ITF": `${year}-${month}-${day}`,
    };
}

//General function to add new tournament entries
export async function addTournDatabaseEntries(){

    // Define a start date (date 1 month previous) (mm/dd/yyyy for UTR, yyyy-mm-dd for ITF)
    const twoWeeksAgoDate = new Date();
    twoWeeksAgoDate.setDate(currentDate.getDate() - 14); // Subtract 14 days

    const startDate = formatDate(twoWeeksAgoDate);
    
    // Define an end date (current date) (mm/dd/yyyy for UTR, yyyy-mm-dd for ITF)
    const currentDate = new Date();
    const endDate = formatDate(currentDate);

    await GetTournamentListUTR(startDate["UTR"], endDate["UTR"], "200", 0);
    await GetTournamentListITF(startDate["ITF"], endDate["ITF"]);
}

//General function to update values for tournament entries
export async function updateDatabaseEntriesTourn(){
    let database = await loadDatabaseTournaments()

    for(let i = 0; i < database.length; i++){
        if(database[i][0] == "UTR"){
            if(database[i][30].includes("No Acceptance List") != true){
                try{
                    let AcceptanceList = await GetTournamentAcceptListUTR(database[i][2])
                    
                    database[i][11] = AcceptanceList[0]
                    database[i][12] = AcceptanceList[1][1]
                    database[i][13] = AcceptanceList[2][1]
                    database[i][14] = AcceptanceList[3][1]
                    database[i][15] = AcceptanceList[4][1]
                    database[i][16] = AcceptanceList[5][1]
                    database[i][17] = AcceptanceList[6][1]
                    database[i][18] = AcceptanceList[7][1]
                    database[i][19] = AcceptanceList[8][1]
                    database[i][20] = AcceptanceList[9][1]
                    database[i][21] = AcceptanceList[10][1]
                    database[i][22] = AcceptanceList[11][1]
                    database[i][23] = AcceptanceList[12][1]
                }
                catch(error){
                    database[i][30].push("No Acceptance List")
                }
            }
        }
        else if(database[i][0] == "ITF"){
            if(database[i][30].includes("No Acceptance List") != true){
                try{
                    let AcceptanceList = await GetAcceptanceListITF(database[i][2])
                    
                    database[i][11] = AcceptanceList[0]
                    database[i][12] = AcceptanceList[1][1]
                    database[i][13] = AcceptanceList[2][1]
                    database[i][14] = AcceptanceList[3][1]
                    database[i][15] = AcceptanceList[4][1]
                    database[i][16] = AcceptanceList[5][1]
                    database[i][17] = AcceptanceList[6][1]
                    database[i][18] = AcceptanceList[7][1]
                    database[i][19] = AcceptanceList[8][1]
                    database[i][20] = AcceptanceList[9][1]
                    database[i][21] = AcceptanceList[10][1]
                    database[i][22] = AcceptanceList[11][1]
                    database[i][23] = AcceptanceList[12][1]
                }
                catch(error){
                    database[i][30].push("No Acceptance List")
                }
            }
        }
    }
    await saveDatabaseTournaments(database)
}

function getFormattedDateFromString(dateString, isEndDate = false) {
    const [month, day, year] = dateString.split('/');
    let date = new Date(`20${year}-${month}-${day}T00:00:00.000Z`);
    if (isEndDate) {
        // Set to the end of the day
        date.setUTCHours(3, 59, 59, 999);
    }
    return date.toISOString();
}
// Fetch UTR tournaments list
async function GetTournamentListUTR(startDate, endDate, displayNum, skipNum){
    async function fetchData() {
        function generateURL(startDate, endDate, displayNum, skipNum) {
            const baseURL = "https://api.utrsports.net/v2/search/events?";
            const params = [
                "top=" + displayNum,
                "skip=" + skipNum,
                "utrType=verified",
                "utrTeamType=singles",
                "genders=m",
                "genders=f",
                "eventTeamTypes=singles",
                "eventTeamTypes=doubles",
                "eventTeamTypes=dingles",
                "showTennisContent=true",
                "showPickleballContent=false",
                `range=eventSchedule.eventStartUtc%3E%3D${encodeURIComponent(startDate)}`,
                `range=eventSchedule.eventEndUtc%3C%3D${encodeURIComponent(endDate)}`,
                "sort=eventSchedule.eventEndUtc%3Adesc",
                "searchOrigin=searchPage"
            ];
        
            return baseURL + params.join("&");
        }
        const agent = new HttpsProxyAgent(proxyUrl)
        let tournListURL = generateURL(startDate, endDate, displayNum, skipNum)
        let tournListOpt = {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en-US,en;q=0.9",
                "newrelic": "eyJ2IjpbMCwxXSwiZCI6eyJ0eSI6IkJyb3dzZXIiLCJhYyI6IjMwMjgxMjMiLCJhcCI6IjUzOTYzMzgzOCIsImlkIjoiMzU4ZjY2N2JlMGI2MmE5YSIsInRyIjoiZDM1ZmMyNzkwMzg2ODU3ZDg4MTFhMWI5YTcyM2ExZDAiLCJ0aSI6MTcyMDc5NDEyMDAwMH19",
                "sec-ch-ua": "\"Google Chrome\";v=\"123\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "x-client-name": "buildId - 70715",
                "Referer": "https://app.utrsports.net/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": null,
            "method": "GET",
            "agent": agent
        }
        try {
            const response = await fetch(tournListURL, tournListOpt);
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
    let data = await fetchData()

    if(data){
        for(let i = 0; i < data.hits.length; i++){
            try {
                console.log(data.hits[i].source.name)
                let AcceptanceList = await GetTournamentAcceptListUTR(data.hits[i].id)
                await sleep(5000)
                let surface = "N/A"
                if(data.hits[i].source.eventDivisions[0].surfaces.length > 0){
                    surface = data.hits[i].source.eventDivisions[0].surfaces[0].label
                }
                await checkAndUpdateDatabaseTournaments("UTR",
                    data.hits[i].source.name, 
                    data.hits[i].id,
                    surface,
                    data.hits[i].source.name,
                    data.hits[i].source.eventSchedule.eventStartUtc,
                    data.hits[i].source.eventSchedule.eventEndUtce,
                    "JT",
                    data.hits[i].source.eventLocations[0].countryName,
                    data.hits[i].source.eventLocations[0].cityStateZip,
                    "N/A",
                    AcceptanceList[0],
                    AcceptanceList[1][1],
                    AcceptanceList[2][1],
                    AcceptanceList[3][1],
                    AcceptanceList[4][1],
                    AcceptanceList[5][1],
                    AcceptanceList[6][1],
                    AcceptanceList[7][1],
                    AcceptanceList[8][1],
                    AcceptanceList[9][1],
                    AcceptanceList[10][1],
                    AcceptanceList[11][1],
                    AcceptanceList[12][1],
                    []
                )
                await sleep(5000)
            } catch(error){
                console.log(error)
                await sleep(10000)
            }
        }
    }
    else{
        throw "No Data"
    }

    return data
}

// const startDate = "07/21/2024";  // mm/dd/yyyy format
// const endDate = "07/29/2024";    // mm/dd/yyyy format
// const listNum = "500";
// let data = await GetTournamentListUTR(startDate, endDate, listNum, 0)
// console.log(data)

// Fetch Data for UTR tournament
async function GetTournamentAcceptListUTR(tournID){

    async function fetchData() {
        const agent = new HttpsProxyAgent(proxyUrl)
        let tournURL = "https://api.utrsports.net/v2/tms/events/" + tournID + "/all-players"
        let tournOpt = {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en-US,en;q=0.9",
                "sec-ch-ua": "\"Google Chrome\";v=\"123\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "x-client-name": "buildId - 70715",
                "Referer": "https://app.utrsports.net/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": null,
            "method": "GET",
            "agent": agent
        }
        try {
            const response = await fetch(tournURL, tournOpt);
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

    let data = await fetchData()
    console.log("Recieved data")
    await sleep(5000)

    var array = [[["Full Name"], ["UTR ID"]], ["Avg UTR Singles"], ["Min UTR Singles"], ["Max UTR Singles"], ["Avg UTR Doubles"], ["Min UTR Doubles"], ["Max UTR Doubles"], ["Avg ITF Singles"], ["Min ITF Singles"], ["Max ITF Singles"], ["Avg ITF Doubles"], ["Min ITF Doubles"], ["Max ITF Doubles"]]

    if(data){
        if(data.players.length > 0){
            for(let i = 0; i < data.players.length; i++){
                let fullName = data.players[i].firstName + " " + data.players[i].lastName
                array[0][0].push(fullName)
                array[0][1].push(data.players[i].playerId)
            }

            console.log("Starting to find UTR and ITF averages")
            let tennisAvgs = await findTennisAverages(array[0], 0)
            console.log("UTR and ITF averages recieved")
            console.log(tennisAvgs)
            array[1].push(tennisAvgs[0][1])
            array[2].push(tennisAvgs[1][1])
            array[3].push(tennisAvgs[2][1])
            array[4].push(tennisAvgs[3][1])
            array[5].push(tennisAvgs[4][1])
            array[6].push(tennisAvgs[5][1])
            array[7].push(tennisAvgs[6][1])
            array[8].push(tennisAvgs[7][1])
            array[9].push(tennisAvgs[8][1])
            array[10].push(tennisAvgs[9][1])
            array[11].push(tennisAvgs[10][1])
            array[12].push(tennisAvgs[11][1])

            await sleep(10000)
        }
        else{
            throw "No Player Data"
        }
    }
    else{
        throw "No Player Data"
    }
    return array
}

// Function to check and update the database
async function checkAndUpdateDatabaseTournaments(platform, tournamentName, tournamentKey, tournamentSurface, tournamentPromoName, startDate, endDate, tennisCategory, hostNation, venue, indoorOrOutdoor, acceptanceList, averageUTRSingles, minUTRSingles, maxUTRSingles, averageUTRDoubles, minUTRDoubles, maxUTRDoubles, averageITFSingles, minITFSingles, maxITFSingles, averageITFDoubles, minITFDoubles, maxITFDoubles, flags) {
    let database = await loadDatabaseTournaments()

    // Check if the ID exists in any row of the 2D array
    let exists = database.some(row => row[1] === tournamentKey);

    // If the ID does not exist, append a new row with the name and ID
    if (!exists) {
        database.push([platform, tournamentName, tournamentKey, tournamentSurface, tournamentPromoName, startDate, endDate, tennisCategory, hostNation, venue, indoorOrOutdoor, acceptanceList, averageUTRSingles, minUTRSingles, maxUTRSingles, averageUTRDoubles, minUTRDoubles, maxUTRDoubles, averageITFSingles, minITFSingles, maxITFSingles, averageITFDoubles, minITFDoubles, maxITFDoubles, flags]);
    }

    await saveDatabaseTournaments(database)
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// FETCH LIST OF TOURNAMENTS
async function GetTournamentListITF(startDate, endDate){

    let database = await loadDatabaseTournaments()

    async function fetchData(circuitCode) {
        const agent = new HttpsProxyAgent(proxyUrl)
        let urlTournList = 'https://www.itftennis.com/tennis/api/TournamentApi/GetCalendar?circuitCode=' + circuitCode + '&searchString=&skip=0&take=100&nationCodes=&zoneCodes=&dateFrom=' + startDate + '&dateTo=' + endDate + '&indoorOutdoor=&categories=&isOrderAscending=true&orderField=startDate&surfaceCodes=';

        const optionsTournList = {
            headers: {
                'accept': '*/*',
                'accept-language': 'en-US,en;q=0.9',
                'sec-ch-ua': '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
            },
            referrerPolicy: 'no-referrer',
            method: 'GET',
            body: null,
            agent: agent
        };
        try {
            const response = await fetch(urlTournList, optionsTournList);
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

    let circCodeJT = "JT"

    let dataJT = await fetchData(circCodeJT);
    if (dataJT) {
        for (let i = 0; i < dataJT.items.length; i++){
            console.log(dataJT.items[i].tournamentKey)
            try{
                let AcceptanceList = await GetAcceptanceListITF(dataJT.items[i].tournamentKey.toLowerCase(), circCodeJT)
                await checkAndUpdateDatabaseTournaments("ITF",
                    dataJT.items[i].tournamentName, 
                    dataJT.items[i].tournamentKey,
                    dataJT.items[i].surfaceDesc,
                    dataJT.items[i].promotionalName,
                    dataJT.items[i].startDate,
                    dataJT.items[i].endDate,
                    dataJT.items[i].tennisCategoryCode,
                    dataJT.items[i].hostNation,
                    dataJT.items[i].venue,
                    dataJT.items[i].indoorOrOutDoor,
                    AcceptanceList[0],
                    AcceptanceList[1][1],
                    AcceptanceList[2][1],
                    AcceptanceList[3][1],
                    AcceptanceList[4][1],
                    AcceptanceList[5][1],
                    AcceptanceList[6][1],
                    AcceptanceList[7][1],
                    AcceptanceList[8][1],
                    AcceptanceList[9][1],
                    AcceptanceList[10][1],
                    AcceptanceList[11][1],
                    AcceptanceList[12][1],
                    []
                );
                console.log(dataJT.items[i].tournamentName)
                await sleep(5000);
            }
            catch(error){
                console.log("No data")
                await sleep(10000);
                // console.error(error)
            }
        }
    } 
    else {
        console.error('Failed to fetch data');
    }

    await saveDatabaseTournaments(database)
}

// FETCH ACCEPTANCE LIST FOR TOURNAMENT (IF IT EXISTS)
async function GetAcceptanceListITF(tournamentKey, tournCircuitCode){
    let acceptURL = 'https://www.itftennis.com/tennis/api/TournamentApi/GetAcceptanceList?tournamentKey=' + tournamentKey + '&circuitCode=' + tournCircuitCode;
    const agent = new HttpsProxyAgent(proxyUrl)
    const optionsAccept = {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/json",
            "if-modified-since": "Thu, 13 Jun 2024 11:52:08 GMT",
            "if-none-match": "\"1d1dc294-cf8b-4d8f-be81-bf6e81ac762c\"",
            "sec-ch-ua": "\"Google Chrome\";v=\"123\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
        },
        "referrerPolicy": "no-referrer",
        "body": null,
        "method": "GET",
        "agent": agent
    }

    async function fetchData() {
        try {
            const response = await fetch(acceptURL, optionsAccept);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;  // Return the JSON object directly
        } catch (error) {
            // console.error('There has been a problem with your fetch operation:', error);
            return null;  // Return null in case of an error
        }
    }

    var array = [[["Full Name"], ["ITF ID"]], ["Avg UTR Singles"], ["Min UTR Singles"], ["Max UTR Singles"], ["Avg UTR Doubles"], ["Min UTR Doubles"], ["Max UTR Doubles"], ["Avg ITF Singles"], ["Min ITF Singles"], ["Max ITF Singles"], ["Avg ITF Doubles"], ["Min ITF Doubles"], ["Max ITF Doubles"]]

    let data = await fetchData()
    console.log("Recieved data")
    await sleep(5000)

    if (data != null && data[0] != undefined) {
        for(let i = 0; i < data[0].entryClassifications.length; i++){
            if(data[0].entryClassifications[i].entryClassification != "WITHDRAWALS"){
                let len = data[0].entryClassifications[i].entries.length;
                for(let j = 0; j < len; j++){
                    if(data[0].entryClassifications[i].entries[j].players != null){
                        let fullName = data[0].entryClassifications[i].entries[j].players[0].givenName + " " + data[0].entryClassifications[i].entries[j].players[0].familyName;
                        array[0][0].push(fullName);
                        array[0][1].push(data[0].entryClassifications[i].entries[j].players[0].playerId)
                    }
                }
            }
        }
        for(let i = 0; i < data[1].entryClassifications.length; i++){
            if(data[0].entryClassifications[i].entryClassification != "WITHDRAWALS"){
                let len = data[1].entryClassifications[i].entries.length;
                for(let j = 0; j < len; j++){
                    if(data[1].entryClassifications[i].entries[j].players != null){
                        let fullName = data[1].entryClassifications[i].entries[j].players[0].givenName + " " + data[1].entryClassifications[i].entries[j].players[0].familyName;
                        array[0][0].push(fullName);
                        array[0][1].push(data[1].entryClassifications[i].entries[j].players[0].playerId)
                    }
                }
            }
        }

        console.log("Starting to get UTR and ITF averages")
        let tennisDataOut = await findTennisAverages(array[0], 1)
        console.log("UTR and ITF averages recieved")
        
        array[1].push(tennisAvgs[0][1])
        array[2].push(tennisAvgs[1][1])
        array[3].push(tennisAvgs[2][1])
        array[4].push(tennisAvgs[3][1])
        array[5].push(tennisAvgs[4][1])
        array[6].push(tennisAvgs[5][1])
        array[7].push(tennisAvgs[6][1])
        array[8].push(tennisAvgs[7][1])
        array[9].push(tennisAvgs[8][1])
        array[10].push(tennisAvgs[9][1])
        array[11].push(tennisAvgs[10][1])
        array[12].push(tennisAvgs[11][1])

    } else {
        throw 'No available player data';
    }

    return array;
}

// Function to read a JSON file from Azure Blob Storage
async function loadDatabaseTournaments() {
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
        return [["Platform","Tournament Name","Tournament Key","Tournament Surface","Tournament Promo Name","Start Date","End Date","Tennis Category","Host nation","Venue","Indoor or Outdoor","Acceptance List","Average UTR Singles","Min UTR Singles","Max UTR Doubles","Average UTR Doubles","Min UTR Doubles","Max UTR Doubles","Average ITF Singles","Min ITF Singles","Max ITF Doubles","Average ITF Doubles","Min ITF Doubles","Max ITF Doubles","Flags"]];
    }
}

// Function to overwrite a JSON file in Azure Blob Storage
async function saveDatabaseTournaments(jsonData) {
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

// Find average UTR and ITF for each tournament (0 for UTR, 1 for ITF)
async function findTennisAverages(attendanceList, platform){
    let array = [["Avg UTR Singles"], ["Min UTR Singles"], ["Max UTR Singles"], ["Avg UTR Doubles"], ["Min UTR Doubles"], ["Max UTR Doubles"], ["Avg ITF Singles"], ["Min ITF Singles"], ["Max ITF Singles"], ["Avg ITF Doubles"], ["Min ITF Doubles"], ["Max ITF Doubles"]]
    let totalUTRSingles = 0
    let totalUTRDoubles = 0
    let totalITFSingles = 0
    let totalITFDoubles = 0

    let minUTRSingles = "NA"
    let maxUTRSingles = "NA"
    let minUTRDoubles = "NA"
    let maxUTRDoubles = "NA"
    let minITFSingles = "NA"
    let maxITFSingles = "NA"
    let minITFDoubles = "NA"
    let maxITFDoubles = "NA"

    if(platform == 0){
        for(let i = 1; i < attendanceList[0].length; i++){
            let TennisDataOut = await checkAndUpdateDatabasePlayersUTR(attendanceList[0][i], attendanceList[1][i])

            if(TennisDataOut[0].length > 1 && TennisDataOut[1].length > 1 && TennisDataOut[2].length > 1 && TennisDataOut[3].length > 1){
                totalUTRSingles = totalUTRSingles + TennisDataOut[0][1]
                totalUTRDoubles = totalUTRDoubles + TennisDataOut[1][1]
                totalITFSingles = totalITFSingles + TennisDataOut[2][1]
                totalITFDoubles = totalITFDoubles + TennisDataOut[3][1]
    
                if(minUTRSingles == "NA" || TennisDataOut[0][1] < minUTRSingles){
                    minUTRSingles = TennisDataOut[0][1]
                }
                if(maxUTRSingles == "NA" || TennisDataOut[0][1] > maxUTRSingles){
                    maxUTRSingles = TennisDataOut[0][1]
                }
                if(minUTRDoubles == "NA" || TennisDataOut[1][1] < minUTRDoubles){
                    minUTRDoubles = TennisDataOut[1][1]
                }
                if(maxUTRDoubles == "NA" || TennisDataOut[1][1] > maxUTRDoubles){
                    maxUTRDoubles = TennisDataOut[1][1]
                }
                if(minITFSingles == "NA" || TennisDataOut[2][1] < minITFSingles){
                    minITFSingles = TennisDataOut[2][1]
                }
                if(maxITFSingles == "NA" || TennisDataOut[2][1] > maxITFSingles){
                    maxITFSingles = TennisDataOut[2][1]
                }
                if(minITFDoubles == "NA" || TennisDataOut[3][1] < minITFDoubles){
                    minITFDoubles = TennisDataOut[3][1]
                }
                if(maxITFDoubles == "NA" || TennisDataOut[3][1] > maxITFDoubles){
                    maxITFDoubles = TennisDataOut[3][1]
                }
            }
            else{
                let tempValUTRSingles = totalUTRSingles / i
                let tempValUTRDoubles = totalUTRDoubles / i
                let tempValITFSingles = totalITFSingles / i
                let tempValITFDoubles = totalITFDoubles / i
    
                totalUTRSingles = totalUTRSingles + tempValUTRSingles
                totalUTRDoubles = totalUTRDoubles + tempValUTRDoubles
                totalITFSingles = totalITFSingles + tempValITFSingles
                totalITFDoubles = totalITFDoubles + tempValITFDoubles
            }
        }
    }
    else if (platform == 1){
        for(let i = 1; i < attendanceList[0].length; i++){
            let TennisDataOut = await checkAndUpdateDatabasePlayersITF(attendanceList[0][i], attendanceList[1][i])

            if(TennisDataOut[0].length > 1 && TennisDataOut[1].length > 1 && TennisDataOut[2].length > 1 && TennisDataOut[3].length > 1){
                totalUTRSingles = totalUTRSingles + TennisDataOut[0][1]
                totalUTRDoubles = totalUTRDoubles + TennisDataOut[1][1]
                totalITFSingles = totalITFSingles + TennisDataOut[2][1]
                totalITFDoubles = totalITFDoubles + TennisDataOut[3][1]
    
                if(minUTRSingles == "NA" || TennisDataOut[0][1] < minUTRSingles){
                    minUTRSingles = TennisDataOut[0][1]
                }
                if(maxUTRSingles == "NA" || TennisDataOut[0][1] > maxUTRSingles){
                    maxUTRSingles = TennisDataOut[0][1]
                }
                if(minUTRDoubles == "NA" || TennisDataOut[1][1] < minUTRDoubles){
                    minUTRDoubles = TennisDataOut[1][1]
                }
                if(maxUTRDoubles == "NA" || TennisDataOut[1][1] > maxUTRDoubles){
                    maxUTRDoubles = TennisDataOut[1][1]
                }
                if(minITFSingles == "NA" || TennisDataOut[2][1] < minITFSingles){
                    minITFSingles = TennisDataOut[2][1]
                }
                if(maxITFSingles == "NA" || TennisDataOut[2][1] > maxITFSingles){
                    maxITFSingles = TennisDataOut[2][1]
                }
                if(minITFDoubles == "NA" || TennisDataOut[3][1] < minITFDoubles){
                    minITFDoubles = TennisDataOut[3][1]
                }
                if(maxITFDoubles == "NA" || TennisDataOut[3][1] > maxITFDoubles){
                    maxITFDoubles = TennisDataOut[3][1]
                }
            }
            else{
                let tempValUTRSingles = totalUTRSingles / i
                let tempValUTRDoubles = totalUTRDoubles / i
                let tempValITFSingles = totalITFSingles / i
                let tempValITFDoubles = totalITFDoubles / i
    
                totalUTRSingles = totalUTRSingles + tempValUTRSingles
                totalUTRDoubles = totalUTRDoubles + tempValUTRDoubles
                totalITFSingles = totalITFSingles + tempValITFSingles
                totalITFDoubles = totalITFDoubles + tempValITFDoubles
            }
        }
    }
    else{
        console.log("Incorrect averages format")
        return
    }

    console.log("total UTR Singles: " + totalUTRSingles)
    console.log("total UTR Doubles: " + totalUTRDoubles)
    console.log("total ITF Singles: " + totalITFSingles)
    console.log("total ITF Doubles: " + totalITFDoubles)

    let avgUTRSingles = totalUTRSingles / attendanceList[0].length
    let avgUTRDoubles = totalUTRDoubles / attendanceList[0].length
    let avgITFSingles = totalITFSingles / attendanceList[0].length
    let avgITFDoubles = totalITFDoubles / attendanceList[0].length

    array[0].push(avgUTRSingles)
    array[1].push(minUTRSingles)
    array[2].push(maxUTRSingles)
    array[3].push(avgUTRDoubles)
    array[4].push(minUTRDoubles)
    array[5].push(maxUTRDoubles)
    array[6].push(avgITFSingles)
    array[7].push(minITFSingles)
    array[8].push(maxITFSingles)
    array[9].push(avgITFDoubles)
    array[10].push(minITFDoubles)
    array[11].push(maxITFDoubles)

    return array
}