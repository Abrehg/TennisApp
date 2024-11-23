// Import the node-fetch package
import fetch from 'node-fetch';
import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { HttpsProxyAgent } from 'https-proxy-agent'
import { checkAndUpdateDatabasePlayersUTR, checkAndUpdateDatabasePlayersITF, checkAndUpdateDatabasePlayersUSTA} from './fetchPlayerInfo.js';

// Define the path to the database file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const path = `${__dirname}/tournaments_database.json`;

// Define Proxy URL
const proxyUrl = 'http://brd-customer-hl_74a6dbf2-zone-tortue_tennis_prod_01:vfkrwksemz8m@brd.superproxy.io:22225';

// Functions to automate: updateEntriesTourn(), addTournDatabaseEntries()

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    const shortYear = String(year).slice(-2);
    
    return {
      "USTA": `${month}/${day}/${shortYear}`,
      "UTR": `${month}/${day}/${year}`,
      "ITF": `${year}-${month}-${day}`,
    };
}

async function addTournDatabaseEntries(){

    // Define a start date (date 1 month previous) (mm/dd/yy for USTA, mm/dd/yyyy for UTR, yyyy-mm-dd for ITF)
    const previousMonthDate = new Date();
    previousMonthDate.setMonth(currentDate.getMonth() - 1);
    if (previousMonthDate.getMonth() === 11) { // Adjust for year wraparound
        previousMonthDate.setFullYear(currentDate.getFullYear() - 1);
    }
    const startDate = formatDate(previousMonthDate);
    
    // Define an end date (current date) (mm/dd/yy for USTA, mm/dd/yyyy for UTR, yyyy-mm-dd for ITF)
    const currentDate = new Date();
    const endDate = formatDate(currentDate);

    await GetTournamentListUSTA(startDate["USTA"], endDate["USTA"], 200, 0);
    await GetTournamentListUTR(startDate["UTR"], endDate["UTR"], "200", 0);
    await GetTournamentListITF(startDate["ITF"], endDate["ITF"]);
}

async function updateDatabaseEntriesTourn(){
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
                    database[i][24] = AcceptanceList[13][1]
                    database[i][25] = AcceptanceList[14][1]
                    database[i][26] = AcceptanceList[15][1]
                    database[i][27] = AcceptanceList[16][1]
                    database[i][28] = AcceptanceList[17][1]
                    database[i][29] = AcceptanceList[18][1]
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
                    database[i][24] = AcceptanceList[13][1]
                    database[i][25] = AcceptanceList[14][1]
                    database[i][26] = AcceptanceList[15][1]
                    database[i][27] = AcceptanceList[16][1]
                    database[i][28] = AcceptanceList[17][1]
                    database[i][29] = AcceptanceList[18][1]
                }
                catch(error){
                    database[i][30].push("No Acceptance List")
                }
            }
        }
        else if(database[i][0] == "USTA"){
            if(database[i][30].includes("No Acceptance List") != true){
                try{
                    let AcceptanceList = await GetAcceptanceListUSTA(database[i][2])
                    
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
                    database[i][24] = AcceptanceList[13][1]
                    database[i][25] = AcceptanceList[14][1]
                    database[i][26] = AcceptanceList[15][1]
                    database[i][27] = AcceptanceList[16][1]
                    database[i][28] = AcceptanceList[17][1]
                    database[i][29] = AcceptanceList[18][1]
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

//Fetch USTA tournaments list
async function GetTournamentListUSTA(startDate, endDate, displayNum, skipNum){
    async function fetchData() {
        const agent = new HttpsProxyAgent(proxyUrl)
        let start = getFormattedDateFromString(startDate, false)
        let end =  getFormattedDateFromString(endDate, true)
        const url = "https://prd-usta-kube.clubspark.pro/unified-search-api/api/Search/tournaments/Query?indexSchema=tournament";
        const headers = {
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/json;charset=UTF-8",
            "sec-ch-ua": "\"Google Chrome\";v=\"123\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            "Referer": "https://playtennis.usta.com/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        };
        const body = JSON.stringify({
            options: {
                size: displayNum,
                from: skipNum,
                sortKey: "date",
                latitude: 28.59551239,
                longitude: -82.48734283
            },
            filters: [
                { key: "organisation-id", items: [] },
                { key: "location-id", items: [] },
                { key: "region-id", items: [] },
                { key: "publish-target", items: [{ value: 1 }] },
                { key: "level-category", items: [{ value: "junior" }], operator: "Or" },
                { key: "organisation-group", items: [], operator: "Or" },
                { key: "date-range", items: [{ 
                    minDate: start, // "2024-07-23T00:00:00.000Z",
                    maxDate: end // "2024-09-01T03:59:59.999Z" 
                }], operator: "Or" },
                { key: "distance", items: [], operator: "Or" },
                { key: "tournament-status", items: [{ value: "registrations-open" }, { value: "registrations-closed" }], operator: "Or" },
                { key: "tournament-level", items: [
                    { value: "00000000-0000-0000-0000-000000000001" },
                    { value: "00000000-0000-0000-0000-000000000002" },
                    { value: "00000000-0000-0000-0000-000000000003" },
                    { value: "00000000-0000-0000-0000-0000000000b3" },
                    { value: "00000000-0000-0000-0000-000000000004" },
                    { value: "00000000-0000-0000-0000-0000000000b4" },
                    { value: "00000000-0000-0000-0000-000000000005" },
                    { value: "00000000-0000-0000-0000-0000000000b5" },
                    { value: "00000000-0000-0000-0000-000000000006" },
                    { value: "00000000-0000-0000-0000-000000000007" },
                    { value: "00000000-0000-0000-0000-000000000001" },
                    { value: "00000000-0000-0000-0000-000000000002" },
                    { value: "00000000-0000-0000-0000-000000000003" },
                    { value: "00000000-0000-0000-0000-0000000000b3" },
                    { value: "00000000-0000-0000-0000-000000000004" },
                    { value: "00000000-0000-0000-0000-0000000000b4" },
                    { value: "00000000-0000-0000-0000-000000000005" },
                    { value: "00000000-0000-0000-0000-0000000000b5" },
                    { value: "00000000-0000-0000-0000-000000000006" },
                    { value: "00000000-0000-0000-0000-000000000007" }
                ], operator: "Or" },
                { key: "event-wtn-level", items: [], operator: "Or" },
                { key: "event-division-age-range", items: [], operator: "Or" },
                { key: "event-division-gender", items: [], operator: "Or" },
                { key: "event-ntrp-rating-level", items: [], operator: "Or" },
                { key: "event-division-age-category", items: [], operator: "Or" },
                { key: "event-division-event-type", items: [], operator: "Or" },
                { key: "event-court-location", items: [], operator: "Or" },
                { key: "event-surface", items: [], operator: "Or" }
            ]
        });

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: headers,
                body: body,
                agent: agent
            });
        
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return data;

        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            throw error;
        }
    }

    // [["Platform","Tournament Name","Tournament Key","Tournament Surface","Tournament Promo Name","Start Date","End Date","Tennis Category","Host nation","Venue","Indoor or Outdoor","Acceptance List","Average UTR Singles","Average UTR Doubles","Average ITF Singles","Average ITF Doubles", "Flags"]]
    // checkAndUpdateDatabaseTournaments(platform, tournamentName, tournamentKey, tournamentSurface, tournamentPromoName, startDate, endDate, tennisCategory, hostNation, venue, indoorOrOutdoor, acceptanceList, averageUTRSingles, averageUTRDoubles, averageITFSingles, averageITFDoubles, flags)
    let data = await fetchData()
    for(let i = 0; i < data.searchResults.length; i++){
        let listAccept = await GetAcceptanceListUSTA(data.searchResults[i].item.id)
        console.log(data.searchResults[i].item)
        console.log(data.searchResults[i].item.id)
        console.log(data.searchResults[i].item.name)
        console.log(data.searchResults[i].item.startDateTime)
        console.log(data.searchResults[i].item.endDateTime)
        console.log(data.searchResults[i].item.primaryLocation)
        console.log(data.searchResults[i].item.primaryLocation.town)
        console.log(data.searchResults[i].item.primaryLocation.county)
        console.log(data.searchResults[i].item.level.name)
        console.log(listAccept)
        await checkAndUpdateDatabaseTournaments("USTA", 
            data.searchResults[i].item.name, 
            data.searchResults[i].item.id, 
            data.searchResults[i].item.level.name, 
            data.searchResults[i].item.name, 
            data.searchResults[i].item.startDateTime, 
            data.searchResults[i].item.endDateTime, 
            "JT", 
            "USA", 
            data.searchResults[i].item.primaryLocation.town, 
            "NA", 
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
            AcceptanceList[13][1],
            AcceptanceList[14][1],
            AcceptanceList[15][1],
            AcceptanceList[16][1],
            AcceptanceList[17][1],
            AcceptanceList[18][1],
            []
        )
    }
    return data
}

// let DataOut = await GetTournamentListUSTA("07/25/24", "08/23/24", 20, 0)
// console.log(DataOut)
// await saveData(DataOut);

// DataOut = await loadData()
// console.log(DataOut)

async function GetAcceptanceListUSTA(tournID){
    async function fetchData(tournamentId) {
        const agent = new HttpsProxyAgent(proxyUrl)
        const url = "https://prd-usta-kube-tournamentdesk-public-api.clubspark.pro/";
        const headers = {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/json",
            "sec-ch-ua": "\"Google Chrome\";v=\"123\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            "Referer": "https://playtennis.usta.com/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        };
    
        const body = JSON.stringify({
            operationName: "getTournamentParticipants",
            variables: { tournamentId },
            query: `query getTournamentParticipants($tournamentId: ID!) {
                getTournamentParticipants(tournamentId: $tournamentId) {
                    participantId
                    participantType
                    participantName
                    participantRole
                    participantStatus
                    person {
                        addresses {
                            city
                            state
                            __typename
                        }
                        personId
                        personOtherIds {
                            personId
                            uniqueOrganisationName
                            __typename
                        }
                        sex
                        standardGivenName
                        standardFamilyName
                        __typename
                    }
                    individualParticipants {
                        participantId
                        participantType
                        person {
                            addresses {
                                city
                                state
                                __typename
                            }
                            personId
                            personOtherIds {
                                personId
                                uniqueOrganisationName
                              __typename
                            }
                            sex
                            standardGivenName
                            standardFamilyName
                            __typename
                        }
                        __typename
                    }
                    draws
                    events {
                        eventId
                        eventType
                        entryStage
                        entryStatus
                        entryPosition
                        statusDetail
                        seedAssignments
                        __typename
                    }
                    teams {
                        participantId
                        participantName
                        participantOtherName
                        __typename
                    }
                    __typename
                }
            }`
        });
    
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: headers,
                body: body,
                agent: agent
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            return data;
    
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            throw error;
        }
    }

    var array = [[["Full Name"], ["USTA ID"]], ["Avg UTR Singles"], ["Min UTR Singles"], ["Max UTR Singles"], ["Avg UTR Doubles"], ["Min UTR Doubles"], ["Max UTR Doubles"], ["Avg ITF Singles"], ["Min ITF Singles"], ["Max ITF Singles"], ["Avg ITF Doubles"], ["Min ITF Doubles"], ["Max ITF Doubles"], ["Avg USTA Singles"], ["Min USTA Singles"], ["Max USTA Singles"], ["Avg USTA Doubles"], ["Min USTA Doubles"], ["Max USTA Doubles"]]

    let data = await fetchData(tournID)
    if(data){
        if(data.data.getTournamentParticipants.length > 0){
            for(let i = 0; i < data.data.getTournamentParticipants.length; i++){
                console.log(data.data.getTournamentParticipants[i])
                console.log(data.data.getTournamentParticipants[i].person.standardGivenName)
                console.log(data.data.getTournamentParticipants[i].person.standardFamilyName)
                let fullName = data.data.getTournamentParticipants[i].person.standardGivenName + data.data.getTournamentParticipants[i].person.standardFamilyName
                array[0][0].push(fullName)
                console.log(data.data.getTournamentParticipants[i].person.personOtherIds[0].personId)
                array[0][1].push(data.data.getTournamentParticipants[i].person.personOtherIds[0].personId)
            }
        
            let tennisAvgs = await findTennisAverages(array[0], 2)
    
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
            array[13].push(tennisAvgs[12][1])
            array[14].push(tennisAvgs[13][1])
            array[15].push(tennisAvgs[14][1])
            array[16].push(tennisAvgs[15][1])
            array[17].push(tennisAvgs[16][1])
            array[18].push(tennisAvgs[17][1])
        }
    }
    
    return array
}

// let acceptData = await GetAcceptanceListUSTA("92F4D3D7-D52E-4417-A2B1-5D3F6D90255C")
// console.log(acceptData)
// await saveData(acceptData);

// let acceptData = await loadData()
// console.log(acceptData)

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
                    AcceptanceList[13][1],
                    AcceptanceList[14][1],
                    AcceptanceList[15][1],
                    AcceptanceList[16][1],
                    AcceptanceList[17][1],
                    AcceptanceList[18][1],
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

    var array = [[["Full Name"], ["UTR ID"]], ["Avg UTR Singles"], ["Min UTR Singles"], ["Max UTR Singles"], ["Avg UTR Doubles"], ["Min UTR Doubles"], ["Max UTR Doubles"], ["Avg ITF Singles"], ["Min ITF Singles"], ["Max ITF Singles"], ["Avg ITF Doubles"], ["Min ITF Doubles"], ["Max ITF Doubles"], ["Avg USTA Singles"], ["Min USTA Singles"], ["Max USTA Singles"], ["Avg USTA Doubles"], ["Min USTA Doubles"], ["Max USTA Doubles"]]

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
            array[13].push(tennisAvgs[12][1])
            array[14].push(tennisAvgs[13][1])
            array[15].push(tennisAvgs[14][1])
            array[16].push(tennisAvgs[15][1])
            array[17].push(tennisAvgs[16][1])
            array[18].push(tennisAvgs[17][1])

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

// let tournID = "253044"
// let dataOut = await GetTournamentAcceptListUTR(tournID)
// console.log(dataOut)
// await saveData(data);

// let data = await loadData()

// Function to check and update the database
async function checkAndUpdateDatabaseTournaments(platform, tournamentName, tournamentKey, tournamentSurface, tournamentPromoName, startDate, endDate, tennisCategory, hostNation, venue, indoorOrOutdoor, acceptanceList, averageUTRSingles, minUTRSingles, maxUTRSingles, averageUTRDoubles, minUTRDoubles, maxUTRDoubles, averageITFSingles, minITFSingles, maxITFSingles, averageITFDoubles, minITFDoubles, maxITFDoubles, averageUSTASingles, minUSTASingles, maxUSTASingles, averageUSTADoubles, minUSTADoubles, maxUSTADoubles, flags) {
    let database = await loadDatabaseTournaments()

    // Check if the ID exists in any row of the 2D array
    let exists = database.some(row => row[1] === tournamentKey);

    // If the ID does not exist, append a new row with the name and ID
    if (!exists) {
        database.push([platform, tournamentName, tournamentKey, tournamentSurface, tournamentPromoName, startDate, endDate, tennisCategory, hostNation, venue, indoorOrOutdoor, acceptanceList, averageUTRSingles, minUTRSingles, maxUTRSingles, averageUTRDoubles, minUTRDoubles, maxUTRDoubles, averageITFSingles, minITFSingles, maxITFSingles, averageITFDoubles, minITFDoubles, maxITFDoubles, averageUSTASingles, minUSTASingles, maxUSTASingles, averageUSTADoubles, minUSTADoubles, maxUSTADoubles, flags]);
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
                    AcceptanceList[13][1],
                    AcceptanceList[14][1],
                    AcceptanceList[15][1],
                    AcceptanceList[16][1],
                    AcceptanceList[17][1],
                    AcceptanceList[18][1],
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

    console.log("Finished JT, starting MT")

    // let circCodeMT = "MT"

    // let dataMT = await fetchData(circCodeMT);
    // if (dataMT) {
    //     for (let i = 0; i < dataMT.items.length; i++){
    //         console.log(dataMT.items[i].tournamentKey)
    //         try{
    //             let AcceptanceList = await GetAcceptanceListITF(dataMT.items[i].tournamentKey.toLowerCase(), circCodeMT)
    //             await checkAndUpdateDatabaseTournaments("ITF",
    //                 dataMT.items[i].tournamentName, 
    //                 dataMT.items[i].tournamentKey,
    //                 dataMT.items[i].surfaceDesc,
    //                 dataMT.items[i].promotionalName,
    //                 dataMT.items[i].startDate,
    //                 dataMT.items[i].endDate,
    //                 dataMT.items[i].tennisCategoryCode,
    //                 dataMT.items[i].hostNation,
    //                 dataMT.items[i].venue,
    //                 dataMT.items[i].indoorOrOutDoor,
    //                 AcceptanceList[0],
    //                 AcceptanceList[1][1],
    //                 AcceptanceList[2][1],
    //                 AcceptanceList[3][1],
    //                 AcceptanceList[4][1],
    //                 AcceptanceList[5][1],
    //                 AcceptanceList[6][1],
    //                 AcceptanceList[7][1],
    //                 AcceptanceList[8][1],
    //                 AcceptanceList[9][1],
    //                 AcceptanceList[10][1],
    //                 AcceptanceList[11][1],
    //                 AcceptanceList[12][1],
    //                 AcceptanceList[13][1],
    //                 AcceptanceList[14][1],
    //                 AcceptanceList[15][1],
    //                 AcceptanceList[16][1],
    //                 AcceptanceList[17][1],
    //                 AcceptanceList[18][1],
    //                 []
    //             )
    //             console.log(dataMT.items[i].tournamentName)
    //             await sleep(5000);
    //         }
    //         catch(error){
    //             console.log("No data")
    //             await sleep(10000);
    //             // console.error(error)
    //         }
    //     }
    // } 
    // else {
    //     console.error('Failed to fetch data');
    // }

    // console.log("Finished MT, starting WT")

    // let circCodeWT = "WT"

    // let dataWT = await fetchData(circCodeWT);
    // if (dataWT) {
    //     for (let i = 0; i < dataWT.items.length; i++){
    //         console.log(dataWT.items[i].tournamentKey)
    //         try{
    //             let AcceptanceList = await GetAcceptanceListITF(dataWT.items[i].tournamentKey.toLowerCase(), circCodeWT)
    //             await checkAndUpdateDatabaseTournaments("ITF",
    //                 dataWT.items[i].tournamentName, 
    //                 dataWT.items[i].tournamentKey,
    //                 dataWT.items[i].surfaceDesc,
    //                 dataWT.items[i].promotionalName,
    //                 dataWT.items[i].startDate,
    //                 dataWT.items[i].endDate,
    //                 dataWT.items[i].tennisCategoryCode,
    //                 dataWT.items[i].hostNation,
    //                 dataWT.items[i].venue,
    //                 dataWT.items[i].indoorOrOutDoor,
    //                 AcceptanceList[0],
    //                 AcceptanceList[1][1],
    //                 AcceptanceList[2][1],
    //                 AcceptanceList[3][1],
    //                 AcceptanceList[4][1],
    //                 AcceptanceList[5][1],
    //                 AcceptanceList[6][1],
    //                 AcceptanceList[7][1],
    //                 AcceptanceList[8][1],
    //                 AcceptanceList[9][1],
    //                 AcceptanceList[10][1],
    //                 AcceptanceList[11][1],
    //                 AcceptanceList[12][1],
    //                 AcceptanceList[13][1],
    //                 AcceptanceList[14][1],
    //                 AcceptanceList[15][1],
    //                 AcceptanceList[16][1],
    //                 AcceptanceList[17][1],
    //                 AcceptanceList[18][1],
    //                 []
    //             )
    //             console.log(dataWT.items[i].tournamentName)
    //             await sleep(5000);
    //         }
    //         catch(error){
    //             console.log("No data")
    //             await sleep(10000);
    //             // console.error(error)
    //         }
    //     }
    // } 
    // else {
    //     console.error('Failed to fetch data');
    // }

    // console.log("Finished WT, starting VT")

    // let circCodeVT = "VT"

    // let dataVT = await fetchData(circCodeVT);
    // if (dataVT) {
    //     for (let i = 0; i < dataVT.items.length; i++){
    //         console.log(dataVT.items[i].tournamentKey)
    //         try{
    //             let AcceptanceList = await GetAcceptanceListITF(dataVT.items[i].tournamentKey.toLowerCase(), circCodeVT)
    //             await checkAndUpdateDatabaseTournaments("ITF",
    //                 dataVT.items[i].tournamentName, 
    //                 dataVT.items[i].tournamentKey,
    //                 dataVT.items[i].surfaceDesc,
    //                 dataVT.items[i].promotionalName,
    //                 dataVT.items[i].startDate,
    //                 dataVT.items[i].endDate,
    //                 dataVT.items[i].tennisCategoryCode,
    //                 dataVT.items[i].hostNation,
    //                 dataVT.items[i].venue,
    //                 dataVT.items[i].indoorOrOutDoor,
    //                 AcceptanceList[0],
    //                 AcceptanceList[1][1],
    //                 AcceptanceList[2][1],
    //                 AcceptanceList[3][1],
    //                 AcceptanceList[4][1],
    //                 AcceptanceList[5][1],
    //                 AcceptanceList[6][1],
    //                 AcceptanceList[7][1],
    //                 AcceptanceList[8][1],
    //                 AcceptanceList[9][1],
    //                 AcceptanceList[10][1],
    //                 AcceptanceList[11][1],
    //                 AcceptanceList[12][1],
    //                 AcceptanceList[13][1],
    //                 AcceptanceList[14][1],
    //                 AcceptanceList[15][1],
    //                 AcceptanceList[16][1],
    //                 AcceptanceList[17][1],
    //                 AcceptanceList[18][1],
    //                 []
    //             )
    //             console.log(dataVT.items[i].tournamentName)
    //             await sleep(5000);
    //         }
    //         catch(error){
    //             console.log("No data")
    //             await sleep(10000);
    //             // console.error(error)
    //         }
    //     }
    // } 
    // else {
    //     console.error('Failed to fetch data');
    // }

    // console.log("Finished VT, starting WCT")

    // let circCodeWCT = "WCT"

    // let dataWCT = await fetchData(circCodeWCT);
    // if (dataWCT) {
    //     for (let i = 0; i < dataWCT.items.length; i++){
    //         console.log(dataWCT.items[i].tournamentKey)
    //         try{
    //             let AcceptanceList = await GetAcceptanceListITF(dataWCT.items[i].tournamentKey.toLowerCase(), circCodeWCT)
    //             await checkAndUpdateDatabaseTournaments("ITF",
    //                 dataWCT.items[i].tournamentName, 
    //                 dataWCT.items[i].tournamentKey,
    //                 dataWCT.items[i].surfaceDesc,
    //                 dataWCT.items[i].promotionalName,
    //                 dataWCT.items[i].startDate,
    //                 dataWCT.items[i].endDate,
    //                 dataWCT.items[i].tennisCategoryCode,
    //                 dataWCT.items[i].hostNation,
    //                 dataWCT.items[i].venue,
    //                 dataWCT.items[i].indoorOrOutDoor,
    //                 AcceptanceList[0],
    //                 AcceptanceList[1][1],
    //                 AcceptanceList[2][1],
    //                 AcceptanceList[3][1],
    //                 AcceptanceList[4][1],
    //                 AcceptanceList[5][1],
    //                 AcceptanceList[6][1],
    //                 AcceptanceList[7][1],
    //                 AcceptanceList[8][1],
    //                 AcceptanceList[9][1],
    //                 AcceptanceList[10][1],
    //                 AcceptanceList[11][1],
    //                 AcceptanceList[12][1],
    //                 AcceptanceList[13][1],
    //                 AcceptanceList[14][1],
    //                 AcceptanceList[15][1],
    //                 AcceptanceList[16][1],
    //                 AcceptanceList[17][1],
    //                 AcceptanceList[18][1],
    //                 []
    //             );
    //             console.log(dataWCT.items[i].tournamentName)
    //             await sleep(5000);
    //         }
    //         catch(error){
    //             console.log("No data")
    //             await sleep(10000);
    //             // console.error(error)
    //         }
    //     }
    // } 
    // else {
    //     console.error('Failed to fetch data');
    // }

    // console.log("Finished WCT, starting BT")

    // let circCodeBT = "BT"

    // let dataBT = await fetchData(circCodeBT);
    // if (dataBT) {
    //     for (let i = 0; i < dataBT.items.length; i++){
    //         console.log(dataBT.items[i].tournamentKey)
    //         try{
    //             let AcceptanceList = await GetAcceptanceListITF(dataBT.items[i].tournamentKey.toLowerCase(), circCodeBT)
    //             await checkAndUpdateDatabaseTournaments("ITF",
    //                 dataBT.items[i].tournamentName, 
    //                 dataBT.items[i].tournamentKey,
    //                 dataBT.items[i].surfaceDesc,
    //                 dataBT.items[i].promotionalName,
    //                 dataBT.items[i].startDate,
    //                 dataBT.items[i].endDate,
    //                 dataBT.items[i].tennisCategoryCode,
    //                 dataBT.items[i].hostNation,
    //                 dataBT.items[i].venue,
    //                 dataBT.items[i].indoorOrOutDoor,
    //                 AcceptanceList[0],
    //                 AcceptanceList[1][1],
    //                 AcceptanceList[2][1],
    //                 AcceptanceList[3][1],
    //                 AcceptanceList[4][1],
    //                 AcceptanceList[5][1],
    //                 AcceptanceList[6][1],
    //                 AcceptanceList[7][1],
    //                 AcceptanceList[8][1],
    //                 AcceptanceList[9][1],
    //                 AcceptanceList[10][1],
    //                 AcceptanceList[11][1],
    //                 AcceptanceList[12][1],
    //                 AcceptanceList[13][1],
    //                 AcceptanceList[14][1],
    //                 AcceptanceList[15][1],
    //                 AcceptanceList[16][1],
    //                 AcceptanceList[17][1],
    //                 AcceptanceList[18][1],
    //                 []
    //             );
    //             console.log(dataBT.items[i].tournamentName)
    //             await sleep(5000);
    //         }
    //         catch(error){
    //             console.log("No data")
    //             await sleep(10000);
    //             // console.error(error)
    //         }
    //     }
    // } 
    // else {
    //     console.error('Failed to fetch data');
    // }

    // console.log("Finished BT")

    await saveDatabaseTournaments(database)
}

// let startDateITF = "2024-07-19";
// let endDateITF = "2024-08-19";
// await GetTournamentListITF(startDateITF, endDateITF);

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

    var array = [[["Full Name"], ["ITF ID"]], ["Avg UTR Singles"], ["Min UTR Singles"], ["Max UTR Singles"], ["Avg UTR Doubles"], ["Min UTR Doubles"], ["Max UTR Doubles"], ["Avg ITF Singles"], ["Min ITF Singles"], ["Max ITF Singles"], ["Avg ITF Doubles"], ["Min ITF Doubles"], ["Max ITF Doubles"], ["Avg USTA Singles"], ["Min USTA Singles"], ["Max USTA Singles"], ["Avg USTA Doubles"], ["Min USTA Doubles"], ["Max USTA Doubles"]]

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
        array[13].push(tennisAvgs[12][1])
        array[14].push(tennisAvgs[13][1])
        array[15].push(tennisAvgs[14][1])
        array[16].push(tennisAvgs[15][1])
        array[17].push(tennisAvgs[16][1])
        array[18].push(tennisAvgs[17][1])

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
    return [["Platform","Tournament Name","Tournament Key","Tournament Surface","Tournament Promo Name","Start Date","End Date","Tennis Category","Host nation","Venue","Indoor or Outdoor","Acceptance List","Average UTR Singles","Min UTR Singles","Max UTR Doubles","Average UTR Doubles","Min UTR Doubles","Max UTR Doubles","Average ITF Singles","Min ITF Singles","Max ITF Doubles","Average ITF Doubles","Min ITF Doubles","Max ITF Doubles","Average USTA Singles","Min USTA Singles","Max USTA Singles","Average USTA Doubles","Min USTA Doubles","Max USTA Doubles","Flags"]];
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

// Find average UTR, ITF, and USTA for each tournament (0 for UTR, 1 for ITF, 2 for USTA)
async function findTennisAverages(attendanceList, platform){
    let array = [["Avg UTR Singles"], ["Min UTR Singles"], ["Max UTR Singles"], ["Avg UTR Doubles"], ["Min UTR Doubles"], ["Max UTR Doubles"], ["Avg ITF Singles"], ["Min ITF Singles"], ["Max ITF Singles"], ["Avg ITF Doubles"], ["Min ITF Doubles"], ["Max ITF Doubles"], ["Avg USTA Singles"], ["Min USTA Singles"], ["Max USTA Singles"], ["Avg USTA Doubles"], ["Min USTA Doubles"], ["Max USTA Doubles"]]
    let totalUTRSingles = 0
    let totalUTRDoubles = 0
    let totalITFSingles = 0
    let totalITFDoubles = 0
    let totalUSTASingles = 0
    let totalUSTADoubles = 0

    let minUTRSingles = "NA"
    let maxUTRSingles = "NA"
    let minUTRDoubles = "NA"
    let maxUTRDoubles = "NA"
    let minITFSingles = "NA"
    let maxITFSingles = "NA"
    let minITFDoubles = "NA"
    let maxITFDoubles = "NA"
    let minUSTASingles = "NA"
    let maxUSTASingles = "NA"
    let minUSTADoubles = "NA"
    let maxUSTADoubles = "NA"

    if(platform == 0){
        for(let i = 1; i < attendanceList[0].length; i++){
            let TennisDataOut = await checkAndUpdateDatabasePlayersUTR(attendanceList[0][i], attendanceList[1][i])

            if(TennisDataOut[0].length > 1 && TennisDataOut[1].length > 1 && TennisDataOut[2].length > 1 && TennisDataOut[3].length > 1){
                totalUTRSingles = totalUTRSingles + TennisDataOut[0][1]
                totalUTRDoubles = totalUTRDoubles + TennisDataOut[1][1]
                totalITFSingles = totalITFSingles + TennisDataOut[2][1]
                totalITFDoubles = totalITFDoubles + TennisDataOut[3][1]
                totalUSTASingles = totalUSTASingles + TennisDataOut[4][1]
                totalUSTADoubles = totalUSTADoubles + TennisDataOut[5][1]
    
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
                if(minUSTASingles == "NA" || TennisDataOut[4][1] < minUSTASingles){
                    minUSTASingles = TennisDataOut[4][1]
                }
                if(maxUSTASingles == "NA" || TennisDataOut[4][1] > maxUSTASingles){
                    maxUSTASingles = TennisDataOut[4][1]
                }
                if(minUSTADoubles == "NA" || TennisDataOut[5][1] < minUSTADoubles){
                    minUSTADoubles = TennisDataOut[5][1]
                }
                if(maxUSTADoubles == "NA" || TennisDataOut[5][1] > maxUSTADoubles){
                    maxUSTADoubles = TennisDataOut[5][1]
                }
            }
            else{
                let tempValUTRSingles = totalUTRSingles / i
                let tempValUTRDoubles = totalUTRDoubles / i
                let tempValITFSingles = totalITFSingles / i
                let tempValITFDoubles = totalITFDoubles / i
                let tempValUSTASingles = totalUSTASingles / i
                let tempValUSTADoubles = totalUSTADoubles / i
    
                totalUTRSingles = totalUTRSingles + tempValUTRSingles
                totalUTRDoubles = totalUTRDoubles + tempValUTRDoubles
                totalITFSingles = totalITFSingles + tempValITFSingles
                totalITFDoubles = totalITFDoubles + tempValITFDoubles
                totalUSTASingles = totalUSTASingles + tempValUSTASingles
                totalUSTADoubles = totalUSTADoubles + tempValUSTADoubles
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
                totalUSTASingles = totalUSTASingles + TennisDataOut[4][1]
                totalUSTADoubles = totalUSTADoubles + TennisDataOut[5][1]
    
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
                if(minUSTASingles == "NA" || TennisDataOut[4][1] < minUSTASingles){
                    minUSTASingles = TennisDataOut[4][1]
                }
                if(maxUSTASingles == "NA" || TennisDataOut[4][1] > maxUSTASingles){
                    maxUSTASingles = TennisDataOut[4][1]
                }
                if(minUSTADoubles == "NA" || TennisDataOut[5][1] < minUSTADoubles){
                    minUSTADoubles = TennisDataOut[5][1]
                }
                if(maxUSTADoubles == "NA" || TennisDataOut[5][1] > maxUSTADoubles){
                    maxUSTADoubles = TennisDataOut[5][1]
                }
            }
            else{
                let tempValUTRSingles = totalUTRSingles / i
                let tempValUTRDoubles = totalUTRDoubles / i
                let tempValITFSingles = totalITFSingles / i
                let tempValITFDoubles = totalITFDoubles / i
                let tempValUSTASingles = totalUSTASingles / i
                let tempValUSTADoubles = totalUSTADoubles / i
    
                totalUTRSingles = totalUTRSingles + tempValUTRSingles
                totalUTRDoubles = totalUTRDoubles + tempValUTRDoubles
                totalITFSingles = totalITFSingles + tempValITFSingles
                totalITFDoubles = totalITFDoubles + tempValITFDoubles
                totalUSTASingles = totalUSTASingles + tempValUSTASingles
                totalUSTADoubles = totalUSTADoubles + tempValUSTADoubles
            }
        }
    }
    else if(platform == 2){
        for(let i = 1; i < attendanceList[0].length; i++){
            let TennisDataOut = await checkAndUpdateDatabasePlayersUSTA(attendanceList[0][i], attendanceList[1][i])

            if(TennisDataOut[0].length > 1 && TennisDataOut[1].length > 1 && TennisDataOut[2].length > 1 && TennisDataOut[3].length > 1){
                totalUTRSingles = totalUTRSingles + TennisDataOut[0][1]
                totalUTRDoubles = totalUTRDoubles + TennisDataOut[1][1]
                totalITFSingles = totalITFSingles + TennisDataOut[2][1]
                totalITFDoubles = totalITFDoubles + TennisDataOut[3][1]
                totalUSTASingles = totalUSTASingles + TennisDataOut[4][1]
                totalUSTADoubles = totalUSTADoubles + TennisDataOut[5][1]

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
                if(minUSTASingles == "NA" || TennisDataOut[4][1] < minUSTASingles){
                    minUSTASingles = TennisDataOut[4][1]
                }
                if(maxUSTASingles == "NA" || TennisDataOut[4][1] > maxUSTASingles){
                    maxUSTASingles = TennisDataOut[4][1]
                }
                if(minUSTADoubles == "NA" || TennisDataOut[5][1] < minUSTADoubles){
                    minUSTADoubles = TennisDataOut[5][1]
                }
                if(maxUSTADoubles == "NA" || TennisDataOut[5][1] > maxUSTADoubles){
                    maxUSTADoubles = TennisDataOut[5][1]
                }
            }
            else{
                let tempValUTRSingles = totalUTRSingles / i
                let tempValUTRDoubles = totalUTRDoubles / i
                let tempValITFSingles = totalITFSingles / i
                let tempValITFDoubles = totalITFDoubles / i
                let tempValUSTASingles = totalUSTASingles / i
                let tempValUSTADoubles = totalUSTADoubles / i

                totalUTRSingles = totalUTRSingles + tempValUTRSingles
                totalUTRDoubles = totalUTRDoubles + tempValUTRDoubles
                totalITFSingles = totalITFSingles + tempValITFSingles
                totalITFDoubles = totalITFDoubles + tempValITFDoubles
                totalUSTASingles = totalUSTASingles + tempValUSTASingles
                totalUSTADoubles = totalUSTADoubles + tempValUSTADoubles
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
    console.log("total USTA Singles: " + totalUSTASingles)
    console.log("total USTA Doubles: " + totalUSTADoubles)

    let avgUTRSingles = totalUTRSingles / attendanceList[0].length
    let avgUTRDoubles = totalUTRDoubles / attendanceList[0].length
    let avgITFSingles = totalITFSingles / attendanceList[0].length
    let avgITFDoubles = totalITFDoubles / attendanceList[0].length
    let avgUSTASingles = totalUSTASingles / attendanceList[0].length
    let avgUSTADoubles = totalUSTADoubles / attendanceList[0].length

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
    array[12].push(avgUSTASingles)
    array[13].push(minUSTASingles)
    array[14].push(maxUSTASingles)
    array[15].push(avgUSTADoubles)
    array[16].push(minUSTADoubles)
    array[17].push(maxUSTADoubles)

    return array
}