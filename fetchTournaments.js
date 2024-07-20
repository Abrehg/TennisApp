// Import the node-fetch package
import { TIMEOUT } from 'dns';
import fetch from 'node-fetch';
import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { checkAndUpdateDatabasePlayersUTR, checkAndUpdateDatabasePlayersITF } from './fetchPlayerInfo.js';

// Define the path to the file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const path = `${__dirname}/tournaments_database.json`;

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
                "cookie": "OptanonAlertBoxClosed=2024-05-14T22:49:17.156Z; _shopify_y=4a6c3b27-7497-4d05-aa3c-ba9f7c80581a; _tracking_consent=%7B%22con%22%3A%7B%22CMP%22%3A%7B%22a%22%3A%221%22%2C%22m%22%3A%221%22%2C%22p%22%3A%221%22%2C%22s%22%3A%22%22%7D%7D%2C%22v%22%3A%222.1%22%2C%22region%22%3A%22USNJ%22%2C%22reg%22%3A%22%22%7D; _cmp_a=%7B%22purposes%22%3A%7B%22a%22%3Atrue%2C%22p%22%3Atrue%2C%22m%22%3Atrue%2C%22t%22%3Atrue%7D%2C%22display_banner%22%3Afalse%2C%22sale_of_data_region%22%3Afalse%7D; _orig_referrer=https%3A%2F%2Fapp.utrsports.net%2F; _landing_page=%2F; _shopify_s=a74d4e28-57B4-4FE1-3CB3-CA2441F7F9B5; _shopify_sa_t=2024-07-12T14%3A16%3A19.278Z; _shopify_sa_p=; jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNZW1iZXJJZCI6IjEzNjQwODIiLCJlbWFpbCI6IjduazZmN2Z5MjJAcHJpdmF0ZXJlbGF5LmFwcGxlaWQuY29tIiwiVmVyc2lvbiI6IjEiLCJEZXZpY2VMb2dpbklkIjoiMjAyOTA0NTUiLCJuYmYiOjE3MjA3OTQwODMsImV4cCI6MTcyMzM4NjA4MywiaWF0IjoxNzIwNzk0MDgzfQ.cw4ASDiFSdNzggXGhcIOAzJ0HmQmFYJwEOwpwWZRC_E; ut_user_info=SubscriptionType%3DFree%26MemberId%3D1364082%26Email%3D7nk6f7fy22%40privaterelay.appleid.com; OptanonConsent=isGpcEnabled=0&datestamp=Fri+Jul+12+2024+10%3A21%3A59+GMT-0400+(Eastern+Daylight+Time)&version=202311.1.0&browserGpcFlag=0&isIABGlobal=false&hosts=&consentId=1c1cab54-eb20-42b8-adff-b017daddbd1c&interactionCount=1&landingPath=NotLandingPage&groups=C0002%3A1%2CC0001%3A1%2CC0004%3A1%2CC0003%3A1&geolocation=US%3BNJ&AwaitingReconsent=false",
                "Referer": "https://app.utrsports.net/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": null,
            "method": "GET"
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
                    AcceptanceList[4][1]
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
const saveData = async (jsonData) => {
    try {
        const dataPath = `${__dirname}/data.json`
        const dataString = JSON.stringify(jsonData, null, 2); // Convert JSON to string with indentation
        await fs.promises.writeFile(dataPath, dataString, { encoding: 'utf8' });
        console.log('Data saved successfully.');
    } catch (error) {
        console.error('Error saving data:', error);
    }
};

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
};

// const startDate = "07/19/2024";  // mm/dd/yyyy format
// const endDate = "07/29/2024";    // mm/dd/yyyy format
// const listNum = "500";
// let data = await GetTournamentListUTR(startDate, endDate, listNum, 0)
// console.log(data)

// Fetch Data for UTR tournament
async function GetTournamentAcceptListUTR(tournID){

    async function fetchData() {
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
                "cookie": "OptanonAlertBoxClosed=2024-05-14T22:49:17.156Z; _shopify_y=4a6c3b27-7497-4d05-aa3c-ba9f7c80581a; _tracking_consent=%7B%22con%22%3A%7B%22CMP%22%3A%7B%22a%22%3A%221%22%2C%22m%22%3A%221%22%2C%22p%22%3A%221%22%2C%22s%22%3A%22%22%7D%7D%2C%22v%22%3A%222.1%22%2C%22region%22%3A%22USNJ%22%2C%22reg%22%3A%22%22%7D; _cmp_a=%7B%22purposes%22%3A%7B%22a%22%3Atrue%2C%22p%22%3Atrue%2C%22m%22%3Atrue%2C%22t%22%3Atrue%7D%2C%22display_banner%22%3Afalse%2C%22sale_of_data_region%22%3Afalse%7D; _orig_referrer=https%3A%2F%2Fapp.utrsports.net%2F; _landing_page=%2F; _shopify_s=a74d4e28-57B4-4FE1-3CB3-CA2441F7F9B5; _shopify_sa_t=2024-07-12T14%3A16%3A19.278Z; _shopify_sa_p=; jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNZW1iZXJJZCI6IjEzNjQwODIiLCJlbWFpbCI6IjduazZmN2Z5MjJAcHJpdmF0ZXJlbGF5LmFwcGxlaWQuY29tIiwiVmVyc2lvbiI6IjEiLCJEZXZpY2VMb2dpbklkIjoiMjAyOTA0NTUiLCJuYmYiOjE3MjA3OTQwODMsImV4cCI6MTcyMzM4NjA4MywiaWF0IjoxNzIwNzk0MDgzfQ.cw4ASDiFSdNzggXGhcIOAzJ0HmQmFYJwEOwpwWZRC_E; ut_user_info=SubscriptionType%3DFree%26MemberId%3D1364082%26Email%3D7nk6f7fy22%40privaterelay.appleid.com; OptanonConsent=isGpcEnabled=0&datestamp=Fri+Jul+12+2024+10%3A21%3A59+GMT-0400+(Eastern+Daylight+Time)&version=202311.1.0&browserGpcFlag=0&isIABGlobal=false&hosts=&consentId=1c1cab54-eb20-42b8-adff-b017daddbd1c&interactionCount=1&landingPath=NotLandingPage&groups=C0002%3A1%2CC0001%3A1%2CC0004%3A1%2CC0003%3A1&geolocation=US%3BNJ&AwaitingReconsent=false",
                "Referer": "https://app.utrsports.net/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": null,
            "method": "GET"
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

    var array = [[["Full Name"], ["ITF ID"]], ["Avg ITF Singles"], ["Avg ITF Doubles"], ["Avg UTR Singles"], ["Avg UTR Doubles"]]

    if(data){
        if(data.players.length > 0){
            for(let i = 0; i < data.players.length; i++){
                let fullName = data.players[i].firstName + " " + data.players[i].lastName
                array[0][0].push(fullName)
                array[0][1].push(data.players[i].playerId)
            }

            console.log("Starting to find UTR and ITF averages")
            let tennisAvgs = await findTennisAveragesUTR(array[0])
            console.log("UTR and ITF averages recieved")
            console.log(tennisAvgs)
            array[1].push(tennisAvgs[2][1])
            array[2].push(tennisAvgs[3][1])
            array[4].push(tennisAvgs[0][1])
            array[5].push(tennisAvgs[1][1])

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

let tournID = "253044"
let dataOut = await GetTournamentAcceptListUTR(tournID)
// await saveData(data);

// let data = await loadData()

// Find average UTR and ITF for each UTR tournament
async function findTennisAveragesUTR(attendanceList){
    let array = [["Avg UTR Singles"], ["Avg UTR Doubles"], ["Avg ITF Singles"], ["Avg ITF Doubles"]]
    let totalUTRSingles = 0
    let totalUTRDoubles = 0
    let totalITFSingles = 0
    let totalITFDoubles = 0

    for(let i = 0; i < attendanceList[0].length; i++){
        let TennisDataOut = await checkAndUpdateDatabasePlayersUTR(attendanceList[0][i], attendanceList[1][i])
        //console.log(TennisDataOut)
        if(TennisDataOut[0].length > 1 && TennisDataOut[1].length > 1 && TennisDataOut[2].length > 1 && TennisDataOut[3].length > 1){
            totalUTRSingles = totalUTRSingles + TennisDataOut[0][1]
            totalUTRDoubles = totalUTRDoubles + TennisDataOut[1][1]
            totalITFSingles = totalITFSingles + TennisDataOut[2][1]
            totalITFDoubles = totalITFDoubles + TennisDataOut[3][1]
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

    console.log("total UTR Singles: " + totalUTRSingles)
    console.log("total UTR Doubles: " + totalUTRDoubles)
    console.log("total ITF Singles: " + totalITFSingles)
    console.log("total ITF Doubles: " + totalITFDoubles)

    let avgUTRSingles = totalUTRSingles / attendanceList[0].length
    let avgUTRDoubles = totalUTRDoubles / attendanceList[0].length
    let avgITFSingles = totalITFSingles / attendanceList[0].length
    let avgITFDoubles = totalITFDoubles / attendanceList[0].length

    array[2].push(avgUTRSingles)
    array[3].push(avgUTRDoubles)
    array[0].push(avgITFSingles)
    array[1].push(avgITFDoubles)

    return array
}

async function findTennisAveragesITF(attendanceList){
    let array = [["Avg UTR Singles"], ["Avg UTR Doubles"], ["Avg ITF Singles"], ["Avg ITF Doubles"]]
    let totalUTRSingles = 0
    let totalUTRDoubles = 0
    let totalITFSingles = 0
    let totalITFDoubles = 0

    for(let i = 0; i < attendanceList[0].length; i++){
        let TennisDataOut = await checkAndUpdateDatabasePlayersITF(attendanceList[0][i], attendanceList[1][i])
        if(TennisDataOut[0].length > 1 && TennisDataOut[1].length > 1 && TennisDataOut[2].length > 1 && TennisDataOut[3].length > 1){
            totalUTRSingles = totalUTRSingles + TennisDataOut[0][1]
            totalUTRDoubles = totalUTRDoubles + TennisDataOut[1][1]
            totalITFSingles = totalITFSingles + TennisDataOut[2][1]
            totalITFDoubles = totalITFDoubles + TennisDataOut[3][1]
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

    let avgUTRSingles = totalUTRSingles / attendanceList[0].length
    let avgUTRDoubles = totalUTRDoubles / attendanceList[0].length
    let avgITFSingles = totalITFSingles / attendanceList[0].length
    let avgITFDoubles = totalITFDoubles / attendanceList[0].length

    console.log("avg UTR Singles: " + avgUTRSingles)
    console.log("avg UTR Doubles: " + avgUTRDoubles)
    console.log("avg ITF Singles: " + avgITFSingles)
    console.log("avg ITF Doubles: " + avgITFDoubles)

    array[2].push(avgUTRSingles)
    array[3].push(avgUTRDoubles)
    array[0].push(avgITFSingles)
    array[1].push(avgITFDoubles)

    return array
}

// Function to load the database from disk
async function loadDatabaseTournaments() {
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
    return [["Platform","Tournament Name","Tournament Key","Tournament Surface","Tournament Promo Name","Start Date","End Date","Tennis Category","Host nation","Venue","Indoor or Outdoor","Acceptance List","Average UTR Singles","Average UTR Doubles","Average ITF Singles","Average ITF Doubles"]];
    // return [["name","ID"]];
}

// Function to save the database to disk
async function saveDatabaseTournaments(database) {
    try {
        // Convert the array to a JSON string and write it to the file
        const data = JSON.stringify(database, null, 2);
        await fs.promises.writeFile(path, data, 'utf8');
    } catch (error) {
        console.error('Error saving database:', error);
    }
}

// Function to check and update the database
async function checkAndUpdateDatabaseTournaments(platform, tournamentName, tournamentKey, tournamentSurface, tournamentPromoName, startDate, endDate, tennisCategory, hostNation, venue, indoorOrOutdoor, acceptanceList, averageUTRSingles, averageUTRDoubles, averageITFSingles, averageITFDoubles) {
    let database = await loadDatabaseTournaments()

    // Check if the ID exists in any row of the 2D array
    let exists = database.some(row => row[1] === tournamentKey);

    // If the ID does not exist, append a new row with the name and ID
    if (!exists) {
        database.push([platform, tournamentName, tournamentKey, tournamentSurface, tournamentPromoName, startDate, endDate, tennisCategory, hostNation, venue, indoorOrOutdoor, acceptanceList, averageUTRSingles, averageUTRDoubles, averageITFSingles, averageITFDoubles]);
    }

    await saveDatabaseTournaments(database)
}

// let database = await loadDatabaseTournaments()

// // Example usage
// checkAndUpdateDatabaseTournaments("John Doe", "123");
// checkAndUpdateDatabaseTournaments("Jane Smith", "456");
// checkAndUpdateDatabaseTournaments("Adam Smith", "789");

// console.log(database);

// await saveDatabaseTournaments(database)

// console.log("Database saved")

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// FETCH LIST OF TOURNAMENTS
async function GetTournamentListITF(startDate, endDate){

    let database = await loadDatabaseTournaments()

    async function fetchData(circuitCode) {
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
                'cookie': 'ARRAffinity=1a7aff82bc21373b03d8fda86d009014a254fb43661cd4068b45b28f7aa56160; ARRAffinitySameSite=1a7aff82bc21373b03d8fda86d009014a254fb43661cd4068b45b28f7aa56160; nlbi_178373=WoOlfcKrUX74IcPrtoSRdQAAAAC1EQcYItmH4KWM3N+uQ9TB; visid_incap_178373=Dn8i34OrQ9Ou+Uaqt/HTRZfqQ2YAAAAAQUIPAAAAAADSBShpC3aFKHHfoEmA2SwV; OptanonAlertBoxClosed=2024-05-14T22:50:49.470Z; incap_ses_182_178373=HU5GN3HD3Gw7reAVJZiGAlBIjWYAAAAAyYO0SkbdtwHMkkR5PZd4Ww==; OptanonConsent=isGpcEnabled=0&datestamp=Tue+Jul+09+2024+10%3A26%3A21+GMT-0400+(Eastern+Daylight+Time)&version=6.23.0&isIABGlobal=false&hosts=&consentId=825ca760-103e-4af0-ac75-9af72d02f2a9&interactionCount=1&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1%2CC0005%3A1&geolocation=US%3BNJ&AwaitingReconsent=false'
            },
            referrerPolicy: 'no-referrer',
            method: 'GET',
            body: null
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
                    AcceptanceList[4][1]
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

    console.log("Finished JT, starting MT")

    let circCodeMT = "MT"

    let dataMT = await fetchData(circCodeMT);
    if (dataMT) {
        for (let i = 0; i < dataMT.items.length; i++){
            console.log(dataMT.items[i].tournamentKey)
            try{
                let AcceptanceList = await GetAcceptanceListITF(dataMT.items[i].tournamentKey.toLowerCase(), circCodeMT)
                await checkAndUpdateDatabaseTournaments("ITF",
                    dataMT.items[i].tournamentName, 
                    dataMT.items[i].tournamentKey,
                    dataMT.items[i].surfaceDesc,
                    dataMT.items[i].promotionalName,
                    dataMT.items[i].startDate,
                    dataMT.items[i].endDate,
                    dataMT.items[i].tennisCategoryCode,
                    dataMT.items[i].hostNation,
                    dataMT.items[i].venue,
                    dataMT.items[i].indoorOrOutDoor,
                    AcceptanceList[0],
                    AcceptanceList[1][1],
                    AcceptanceList[2][1],
                    AcceptanceList[3][1],
                    AcceptanceList[4][1]
                )
                console.log(dataMT.items[i].tournamentName)
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

    console.log("Finished MT, starting WT")

    let circCodeWT = "WT"

    let dataWT = await fetchData(circCodeWT);
    if (dataWT) {
        for (let i = 0; i < dataWT.items.length; i++){
            console.log(dataWT.items[i].tournamentKey)
            try{
                let AcceptanceList = await GetAcceptanceListITF(dataWT.items[i].tournamentKey.toLowerCase(), circCodeWT)
                await checkAndUpdateDatabaseTournaments("ITF",
                    dataWT.items[i].tournamentName, 
                    dataWT.items[i].tournamentKey,
                    dataWT.items[i].surfaceDesc,
                    dataWT.items[i].promotionalName,
                    dataWT.items[i].startDate,
                    dataWT.items[i].endDate,
                    dataWT.items[i].tennisCategoryCode,
                    dataWT.items[i].hostNation,
                    dataWT.items[i].venue,
                    dataWT.items[i].indoorOrOutDoor,
                    AcceptanceList[0],
                    AcceptanceList[1][1],
                    AcceptanceList[2][1],
                    AcceptanceList[3][1],
                    AcceptanceList[4][1]
                )
                console.log(dataWT.items[i].tournamentName)
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

    console.log("Finished WT, starting VT")

    let circCodeVT = "VT"

    let dataVT = await fetchData(circCodeVT);
    if (dataVT) {
        for (let i = 0; i < dataVT.items.length; i++){
            console.log(dataVT.items[i].tournamentKey)
            try{
                let AcceptanceList = await GetAcceptanceListITF(dataVT.items[i].tournamentKey.toLowerCase(), circCodeVT)
                await checkAndUpdateDatabaseTournaments("ITF",
                    dataVT.items[i].tournamentName, 
                    dataVT.items[i].tournamentKey,
                    dataVT.items[i].surfaceDesc,
                    dataVT.items[i].promotionalName,
                    dataVT.items[i].startDate,
                    dataVT.items[i].endDate,
                    dataVT.items[i].tennisCategoryCode,
                    dataVT.items[i].hostNation,
                    dataVT.items[i].venue,
                    dataVT.items[i].indoorOrOutDoor,
                    AcceptanceList[0],
                    AcceptanceList[1][1],
                    AcceptanceList[2][1],
                    AcceptanceList[3][1],
                    AcceptanceList[4][1]
                )
                console.log(dataVT.items[i].tournamentName)
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

    console.log("Finished VT, starting WCT")

    let circCodeWCT = "WCT"

    let dataWCT = await fetchData(circCodeWCT);
    if (dataWCT) {
        for (let i = 0; i < dataWCT.items.length; i++){
            console.log(dataWCT.items[i].tournamentKey)
            try{
                let AcceptanceList = await GetAcceptanceListITF(dataWCT.items[i].tournamentKey.toLowerCase(), circCodeWCT)
                await checkAndUpdateDatabaseTournaments("ITF",
                    dataWCT.items[i].tournamentName, 
                    dataWCT.items[i].tournamentKey,
                    dataWCT.items[i].surfaceDesc,
                    dataWCT.items[i].promotionalName,
                    dataWCT.items[i].startDate,
                    dataWCT.items[i].endDate,
                    dataWCT.items[i].tennisCategoryCode,
                    dataWCT.items[i].hostNation,
                    dataWCT.items[i].venue,
                    dataWCT.items[i].indoorOrOutDoor,
                    AcceptanceList[0],
                    AcceptanceList[1][1],
                    AcceptanceList[2][1],
                    AcceptanceList[3][1],
                    AcceptanceList[4][1]
                );
                console.log(dataWCT.items[i].tournamentName)
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

    console.log("Finished WCT, starting BT")

    let circCodeBT = "BT"

    let dataBT = await fetchData(circCodeBT);
    if (dataBT) {
        for (let i = 0; i < dataBT.items.length; i++){
            console.log(dataBT.items[i].tournamentKey)
            try{
                let AcceptanceList = await GetAcceptanceListITF(dataBT.items[i].tournamentKey.toLowerCase(), circCodeBT)
                await checkAndUpdateDatabaseTournaments("ITF",
                    dataBT.items[i].tournamentName, 
                    dataBT.items[i].tournamentKey,
                    dataBT.items[i].surfaceDesc,
                    dataBT.items[i].promotionalName,
                    dataBT.items[i].startDate,
                    dataBT.items[i].endDate,
                    dataBT.items[i].tennisCategoryCode,
                    dataBT.items[i].hostNation,
                    dataBT.items[i].venue,
                    dataBT.items[i].indoorOrOutDoor,
                    AcceptanceList[0],
                    AcceptanceList[1][1],
                    AcceptanceList[2][1],
                    AcceptanceList[3][1],
                    AcceptanceList[4][1]
                );
                console.log(dataBT.items[i].tournamentName)
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

    console.log("Finished BT")

    await saveDatabaseTournaments(database)
}

// let startDateITF = "2024-07-19";
// let endDateITF = "2024-08-19";
// await GetTournamentListITF(startDateITF, endDateITF);

// FETCH ACCEPTANCE LIST FOR TOURNAMENT (IF IT EXISTS)
async function GetAcceptanceListITF(tournamentKey, tournCircuitCode){
    let acceptURL = 'https://www.itftennis.com/tennis/api/TournamentApi/GetAcceptanceList?tournamentKey=' + tournamentKey + '&circuitCode=' + tournCircuitCode;

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
            "cookie": "ARRAffinity=1a7aff82bc21373b03d8fda86d009014a254fb43661cd4068b45b28f7aa56160; ARRAffinitySameSite=1a7aff82bc21373b03d8fda86d009014a254fb43661cd4068b45b28f7aa56160; nlbi_178373=WoOlfcKrUX74IcPrtoSRdQAAAAC1EQcYItmH4KWM3N+uQ9TB; visid_incap_178373=Dn8i34OrQ9Ou+Uaqt/HTRZfqQ2YAAAAAQUIPAAAAAADSBShpC3aFKHHfoEmA2SwV; OptanonAlertBoxClosed=2024-05-14T22:50:49.470Z; incap_ses_182_178373=vc6Pa4nrHyCUvSfKIpiGAndajGYAAAAAr9ltOtJ17Lbickuz43XiXg==; ___utmvc=3eaYkC2dGk7ypx4Rr56fBJftLTxPNPb2UoNZDrXG9koWnNkdksPQi2JS/1SZhIJEl6unNRl3tbeaPPfHwPT4XSpPr7nQBmMLOxHvqrtjtu5ADrsXK6uQZJRsy5AAnGwaTTjAkqgC7HYvcNpKj2w8ibFPce9ngjw54RfQHzDU7SOwAVxrdmTwvTQamgKPddjHgkL1rMFYO/cAKplbUUO9OaPsH6wEupjhLwiQHc41un0mqaptBGfbNuYDsaUzeaznh1xKMquXh8b6VXvmMVnwYMhG4m1NeRjYo/ZMKwjJGTsiFHC605pJPxb/jTFyC7t/Heoo6MRQn3nvS8g0iJD+NuhALXzr+Q3WmcZb/n7GJGFx5W1UI+HtzFlN+Za0jjxDqaHOPJsPl4SfB+aXgQVh7u7EgUZNl/gdNTG8UlTxfsGyW9P7EuWgHlKtGA4W9pfUVqTx0jnJQj2D9TWufbLX+xJZVTbvaBaxEXsrwurMV0KwQv+9iD4Zv8Sgh3nS5OXKscRaJ99jzJmvbghXYGIngQg808yPEUyCYq4wSUuAzjW0/eYGZDqBzj0CiCdHTiKRWBa9QIrpVRbwELC8dqXS9cV5vzFgkzXTjHwmD8CO0xccSolvM3o+s8pq7FtKs6KEykgN2gW85mRAKonDLrd34/lLoimuQHm/2N2Y/TpA9FMWsw6wGLanl/nbIUuER3Rqgk+5SGXAN4R0ym1ZKbuHI/eUyL2R6UyOKx8QWaqnghzdaear4DLHxJEGYoFybgsJcI5lvueQWpWuZuPbvqd7skfMxtQNQjBJMqBkGG2viToCVIjwszC+Ar2BZbTl08dU9XpC0SRP5Gi6sQc9Cnxenvb+4fqPRp24N1QkLfz5Zj8pvk3SU+W25zQgRZEUQ4Xcgod/stu6lvnnfFZBC3Pau12CTAbd1VkaCj1W7ukYz+UOOTMyojb3ZC+FMSuaBIAX3/8vicPOzWiNXAFsiInbx739YqfmGbv2bLEBZpAK8VARdHJns+myi9Ywenfttvwh7UBBfRl+7tySb8jexxTFqaG3oCZzXhnIReCeqekz7fLU95QdEYcHBI5IMewtnI2RzxRQEouz1j0kW3A1mwHbAm8E02Xgaajy3w1msOQIhs8C7zZfuBR0Yekr8yx+3LCuYXWF48cNZjZ2LECCEafgFnk+S/UFAH1pJWnKjQII808rp7wGMT2bmjNc9e4H5B+LhURnydSJqfuGFyGNh3uEv290vHDs/Gw2UD5LLaMeaWyWc+2UT8s42TxxmzOJb6tCsbCILsyCkPxj38LTnomSEGSCyPRPyU2UZjwcz+0rPphxDQZZInKfx8rYkM9KgzDdm0J+XYFWQl+CLhF7i6JbnHs10syjyiDqaF2E9dfZoXjf8TD86IwLkV0aQGJmmuEn1e1+ippxwtN5mC4oirN0qxVwM76JknfCEXhcj5PbG3t59vrKaGDGLUmZdISvnjVU7w0V0L9VsoDulLRJb33FybiNa1MzrOHU6nQrhEBtsHeM+OQxXcL05qYSOHCbMHaIA8U2eq8iEJzF//FzZHOod6Y1MqW/EpiyIkKC0QWCvcXC6lDn7ucgOMA/s2zXwKuJfU+NCMxaq1gwBG8TJr7K/Nbn7VMKunQHoMTkjHvVdw5ZeaCgL3Ktp2UkzUxVof4URQ7ILaTY7/lkYiaWrKvXH4X9ofyCT0YviUNV8p7m7h1KODz2nVEan1ODlAEAPnRXBwWkaS9xFafdLKyFayZsUnjPK7zhwB5Grhkd4JQQ8AUTwPbCFhSFfNtCWSSWtBXiVZ6HFOOENX9nuzno1OmDBMHB8w6GOhxRK+p/9W7X1Diccz6GmWJxA5xU2p4x4vXyVD9eMEtfyVRyjhhAy4/OkuTNpswtB8eQkbzy9eMEuMisv9ClEJx/CDULrG2WIJq8B8Xpflg7qyU0UFDVkqDXJpwwrfeW/sQeX8eqS4AfJKJ8lF86I0qXG87m9pRvHIi8XOZuqFdXCzzLiWFc/MSp75DnnCOvzkJsTEXJq0rhI7qRp6QhMOvA7uzhK3zVG995dYKUPchIMUTo3k55Tgf/xO4HO3tBKtSvCjjIZyI/vB1f4RTDWE7BQ6bfn3KhLtbsDtoyGppMJSXAgAgaBtQ33nr1HaZ9F3j5OWY2+P7QJQc45A6cdYEDYK28Ln9o/+hPuyRR1sgHZXTK4Y/bo8rgBQkv7LPEhh/0CWrDxvbjIj//ZIUOloE4/45R82Eq6McAEdSk1vhbdA7imUu8CklkWv7QGHFsm9nGujyqXZvtitPMR7Gc6HyTj7O0X+B0+5kMKTvqxWL7wyCAPhG8wiy59AlBfK74PmllKFkpxDtGnIXrTvCqsOE8FR3eZ8RX84RgnjwGFHbSWLDVEW6uCUPp/wzCMWPsrumQaoLgKUkAy81RBM+91q/R7R3f0FCrCXEwPOpw3IHcPCDXb6JNndYDcejs+KUSecQY0S5A39ch1jRBMWyjdXK1i47V8OlL5J16B2unTkY6q8UhP7vRyPDYMzLJOQlJz/07LeN29QLX67sf97S+MFSafRNJUlU0P8oJ9bYoUdOETJftEOSh4rel34JVRS/1iS99W8utQvKPcDoKHo+CzaIJ+c8TINDLpZsy8cauqCn1bDPAgIwyRi951WkASMPaTjg6Sft7iGE+y4QrA2J3JZ4COKw5sv+EXRgPGxQ+5dKo3ZcOfHKt21VUzeEjlXNKdWttltOb8V0/ldkP6zI77F6I2zqXq0Lietht1P9IBDdx/HBIkVGM9rCQVHtAGpCQ/UEaMoBc1vYdaisg0Krcu37+P+GfgJksZGlnZXN0PTE5MjczOCxzPTYxOGU4MWFlODM5MDllOGE2YThhYTQ2YjY2YjI1ZDg5YWQ3ZWEwODg2MTliYTE5MDY1NmRhMjhiNjM3MDZhYTg2N2E4YWM3MTg5YjA2Zjc0; OptanonConsent=isGpcEnabled=0&datestamp=Mon+Jul+08+2024+17%3A30%3A34+GMT-0400+(Eastern+Daylight+Time)&version=6.23.0&isIABGlobal=false&hosts=&consentId=825ca760-103e-4af0-ac75-9af72d02f2a9&interactionCount=1&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1%2CC0005%3A1&geolocation=US%3BNJ&AwaitingReconsent=false"
        },
        "referrerPolicy": "no-referrer",
        "body": null,
        "method": "GET"
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

    var array = [[["Full Name"], ["ITF ID"]], ["Avg ITF Singles"], ["Avg ITF Doubles"], ["Avg UTR Singles"], ["Avg UTR Doubles"]]

    let data = await fetchData()
    console.log("Recieved data")
    await sleep(5000)

    // [["Avg UTR Singles"], ["Avg UTR Doubles"], ["Avg ITF Singles"], ["Avg ITF Doubles"]] = findTennisAveragesITF(attendanceList)

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
        let tennisDataOut = await findTennisAveragesITF(array[0])
        console.log("UTR and ITF averages recieved")
        
        array[1].push(tennisDataOut[2][1])
        array[2].push(tennisDataOut[3][1])
        array[3].push(tennisDataOut[0][1])
        array[4].push(tennisDataOut[1][1])
    } else {
        throw 'No available player data';
    }

    return array;
}

// let tournamentKey = 'j-j60-arm-2024-003'; //Full list
// let circCode = 'JT'
// // let tournamentKey = 'j-j60-kgz-2024-002'; //No data
// GetAcceptanceList(tournamentKey, circCode).then(out => {
//     console.log(out);
// });
