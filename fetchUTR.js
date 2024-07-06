// Import the node-fetch package
import { TIMEOUT } from 'dns';
import fetch from 'node-fetch';

// FETCH LIST OF TOURNAMENTS
// function GetTournamentListITF(startDate, endDate){
//     let urlTournList = 'https://www.itftennis.com/tennis/api/TournamentApi/GetCalendar?circuitCode=JT&searchString=&skip=0&take=100&nationCodes=&zoneCodes=&dateFrom=' + startDate + '&dateTo=' + endDate + '&indoorOutdoor=&categories=&isOrderAscending=true&orderField=startDate&surfaceCodes=';

//     const optionsTournList = {
//         headers: {
//             'accept': '*/*',
//             'accept-language': 'en-US,en;q=0.9',
//             'sec-ch-ua': '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
//             'sec-ch-ua-mobile': '?0',
//             'sec-ch-ua-platform': '"macOS"',
//             'sec-fetch-dest': 'empty',
//             'sec-fetch-mode': 'cors',
//             'sec-fetch-site': 'same-origin',
//             'cookie': 'ARRAffinity=1a7aff82bc21373b03d8fda86d009014a254fb43661cd4068b45b28f7aa56160; ARRAffinitySameSite=1a7aff82bc21373b03d8fda86d009014a254fb43661cd4068b45b28f7aa56160; nlbi_178373=WoOlfcKrUX74IcPrtoSRdQAAAAC1EQcYItmH4KWM3N+uQ9TB; visid_incap_178373=Dn8i34OrQ9Ou+Uaqt/HTRZfqQ2YAAAAAQUIPAAAAAADSBShpC3aFKHHfoEmA2SwV; OptanonAlertBoxClosed=2024-05-14T22:50:49.470Z; incap_ses_182_178373=n0aTKhTjEC1DFfdtIJiGAsz0aWYAAAAANfu4T3XHYnHydozVU8HUeQ==; OptanonConsent=isGpcEnabled=0&datestamp=Wed+Jun+12+2024+15%3A20%3A52+GMT-0400+(Eastern+Daylight+Time)&version=6.23.0&isIABGlobal=false&hosts=&consentId=825ca760-103e-4af0-ac75-9af72d02f2a9&interactionCount=1&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1%2CC0005%3A1&geolocation=US%3BNJ&AwaitingReconsent=false'
//         },
//         referrerPolicy: 'no-referrer',
//         method: 'GET',
//         body: null
//     };

//     async function fetchData() {
//         try {
//             const response = await fetch(urlTournList, optionsTournList);
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             const data = await response.json();
//             return data;  // Return the JSON object directly
//         } catch (error) {
//             console.error('There has been a problem with your fetch operation:', error);
//             return null;  // Return null in case of an error
//         }
//     }

//     var array = [["Tournament Name"],["Tournament Key"],["Tournament Link"],["Tournament Promo Name"]];


//     fetchData().then(data => {
//         if (data) {
//             for (let i = 0; i < data.items.length; i++){
//                 console.log(data.items[i]);
//                 array[0].push(data.items[i].tournamentName);
//                 console.log(data.items[i].tournamentName);
//                 array[1].push(data.items[i].tournamentKey);
//                 console.log(data.items[i].tournamentKey);
//                 array[2].push("https://www.itftennis.com" + data.items[i].tournamentLink);
//                 console.log("https://www.itftennis.com" + data.items[i].tournamentLink);
//                 array[3].push(data.items[i].promotionalName);
//                 console.log(data.items[i].promotionalName);
//             }
//         } else {
//             console.error('Failed to fetch data');
//         }
//     });
//     return array;
// }

// let startDate = "2024-04-01";
// let endDate = "2024-04-30";
// let array = GetTournamentListITF(startDate, endDate);

// FETCH ACCEPTANCE LIST FOR TOURNAMENT (IF IT EXISTS)
async function GetAcceptanceList(tournamentKey, tournCircuitCode){
    let acceptURL = "https://www.itftennis.com/tennis/api/TournamentApi/GetAcceptanceList?tournamentKey=" + tournamentKey + "&circuitCode=" + tournCircuitCode;

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
            "cookie": "ARRAffinity=1a7aff82bc21373b03d8fda86d009014a254fb43661cd4068b45b28f7aa56160; ARRAffinitySameSite=1a7aff82bc21373b03d8fda86d009014a254fb43661cd4068b45b28f7aa56160; nlbi_178373=WoOlfcKrUX74IcPrtoSRdQAAAAC1EQcYItmH4KWM3N+uQ9TB; visid_incap_178373=Dn8i34OrQ9Ou+Uaqt/HTRZfqQ2YAAAAAQUIPAAAAAADSBShpC3aFKHHfoEmA2SwV; OptanonAlertBoxClosed=2024-05-14T22:50:49.470Z; incap_ses_182_178373=WsI7EnfnNBqws1tuIJiGAqDaamYAAAAAlsJCqdhBS2DLH/UOtuVxYw==; OptanonConsent=isGpcEnabled=0&datestamp=Thu+Jun+13+2024+07%3A52%3A24+GMT-0400+(Eastern+Daylight+Time)&version=6.23.0&isIABGlobal=false&hosts=&consentId=825ca760-103e-4af0-ac75-9af72d02f2a9&interactionCount=1&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1%2CC0005%3A1&geolocation=US%3BNJ&AwaitingReconsent=false"
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
            console.error('There has been a problem with your fetch operation:', error);
            return null;  // Return null in case of an error
        }
    }

    var array = [["Full Name"], ["UTR singles rating"], ["UTR doubles rating"], ["ITF singles ranking"], ["ITF doubles ranking"]];

    let data = await fetchData()

    const parts = tournamentKey.split('-');
    const year = parts[3];

    if (data) {
        for(let i = 0; i < data[0].entryClassifications.length; i++){
            if(data[0].entryClassifications[i].entryClassification != "WITHDRAWALS"){
                let len = data[0].entryClassifications[i].entries.length;
                for(let j = 0; j < len; j++){
                    if(data[0].entryClassifications[i].entries[j].players != null){
                        console.log("New Entry");
                        console.log(data[0].entryClassifications[i].entries[j].players[0]);
                        let fullName = data[0].entryClassifications[i].entries[j].players[0].givenName + " " + data[0].entryClassifications[i].entries[j].players[0].familyName;
                        array[0].push(fullName);
                        console.log(array[0][array[0].length - 1]);
                        // let UTRData = await GetPlayerInfoUTR(fullName);
                        // array[1].push(UTRData[1][1]);
                        // console.log(UTRData[1][1]);
                        // array[2].push(UTRData[2][1]);
                        // console.log(UTRData[2][1]);
                        try{
                            let ITFData = await GetPlayerInfoITF(fullName, tournCircuitCode);
                            console.log(ITFData);
                            if(ITFData[0].length > 1 && ITFData[1].length > 1 && ITFData[2].length > 1 && ITFData[3].length > 1){
                                array[3].push(ITFData[1][1]);
                                array[4].push(ITFData[2][1]);
                            }
                            else{
                                throw "No available data"
                            }
                        }
                        catch(err){
                            console.log(err)
                        }
                    }
                }
            }
        }
        for(let i = 0; i < data[1].entryClassifications.length; i++){
            if(data[0].entryClassifications[i].entryClassification != "WITHDRAWALS"){
                let len = data[1].entryClassifications[i].entries.length;
                for(let j = 0; j < len; j++){
                    if(data[1].entryClassifications[i].entries[j].players != null){
                        console.log("New Entry");
                        console.log(data[1].entryClassifications[i].entries[j].players[0]);
                        let fullName = data[1].entryClassifications[i].entries[j].players[0].givenName + " " + data[1].entryClassifications[i].entries[j].players[0].familyName;
                        array[0].push(fullName);
                        console.log(array[0][array[0].length - 1]);
                        // let UTRData = await GetPlayerInfoUTR(fullName);
                        // console.log(UTRData)
                        // if(UTRData[0].length > 1 && UTRData[1].length > 1 && UTRData[2].length > 1 && UTRData[3].length > 1){
                        //     array[1].push(UTRData[1][1]);
                        //     console.log(UTRData[1][1]);
                        //     array[2].push(UTRData[2][1]);
                        //     console.log(UTRData[2][1]);
                        // }
                        try{
                            let ITFData = await GetPlayerInfoITF(fullName, tournCircuitCode);
                            console.log(ITFData);
                            if(ITFData[0].length > 1 && ITFData[1].length > 1 && ITFData[2].length > 1 && ITFData[3].length > 1){
                                array[3].push(ITFData[1][1]);
                                array[4].push(ITFData[2][1]);
                            }
                            else{
                                throw "No available data"
                            }
                        }
                        catch(err){
                            console.log(err)
                        }
                    }
                }
            }
        }
    } else {
        console.log('No available data');
    }

    return array;
}

let tournamentKey = 'j-j60-arm-2024-003'; //Full list
let circCode = 'JT'
// let tournamentKey = 'j-j60-kgz-2024-002'; //No data
GetAcceptanceList(tournamentKey, circCode).then(out => {
    console.log(out);
});

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

// // Fetch profile for UTR and name
// async function GetPlayerUTRbyID(ID){
//     let urlProfileInfo = "https://api.utrsports.net/v1/player/" + ID + "/profile";

//     const optionsProfile = {
//         "headers": {
//             "accept": "application/json, text/plain, */*",
//             "accept-language": "en-US,en;q=0.9",
//             "newrelic": "eyJ2IjpbMCwxXSwiZCI6eyJ0eSI6IkJyb3dzZXIiLCJhYyI6IjMwMjgxMjMiLCJhcCI6IjUzOTYzMzgzOCIsImlkIjoiODUwMmE0MDRiNWM0YjhlZSIsInRyIjoiMTM5NWQ3YmRjZTRiMTJlNTFlNzI5NzY5YWY3ZGRmZjAiLCJ0aSI6MTcxODEzNzE2NTY0OH19",
//             "sec-ch-ua": "\"Google Chrome\";v=\"123\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
//             "sec-ch-ua-mobile": "?0",
//             "sec-ch-ua-platform": "\"macOS\"",
//             "sec-fetch-dest": "empty",
//             "sec-fetch-mode": "cors",
//             "sec-fetch-site": "same-site",
//             "x-client-name": "buildId - 67071",
//             "cookie": "OptanonAlertBoxClosed=2024-05-14T22:49:17.156Z; jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNZW1iZXJJZCI6IjEzNjQwODIiLCJlbWFpbCI6IjduazZmN2Z5MjJAcHJpdmF0ZXJlbGF5LmFwcGxlaWQuY29tIiwiVmVyc2lvbiI6IjEiLCJEZXZpY2VMb2dpbklkIjoiMTk1OTUwNDEiLCJuYmYiOjE3MTU3MjY5OTYsImV4cCI6MTcxODMxODk5NiwiaWF0IjoxNzE1NzI2OTk2fQ.wzu7z83_1WmhZbvPbaG7a5hAlKw2jK5ZefeUrvbL7vo; ut_user_info=SubscriptionType%3DFree%26MemberId%3D1364082%26Email%3D7nk6f7fy22%40privaterelay.appleid.com; _cmp_a=%7B%22purposes%22%3A%7B%22a%22%3Atrue%2C%22p%22%3Atrue%2C%22m%22%3Atrue%2C%22t%22%3Atrue%7D%2C%22display_banner%22%3Afalse%2C%22sale_of_data_region%22%3Afalse%7D; _shopify_y=4a6c3b27-7497-4d05-aa3c-ba9f7c80581a; _landing_page=%2F; _tracking_consent=%7B%22con%22%3A%7B%22CMP%22%3A%7B%22a%22%3A%221%22%2C%22m%22%3A%221%22%2C%22p%22%3A%221%22%2C%22s%22%3A%22%22%7D%7D%2C%22v%22%3A%222.1%22%2C%22region%22%3A%22USNJ%22%2C%22reg%22%3A%22%22%7D; _orig_referrer=; OptanonConsent=isGpcEnabled=0&datestamp=Tue+Jun+11+2024+16%3A19%3A22+GMT-0400+(Eastern+Daylight+Time)&version=202311.1.0&browserGpcFlag=0&isIABGlobal=false&hosts=&consentId=1c1cab54-eb20-42b8-adff-b017daddbd1c&interactionCount=1&landingPath=NotLandingPage&groups=C0002%3A1%2CC0001%3A1%2CC0004%3A1%2CC0003%3A1&geolocation=US%3BNJ&AwaitingReconsent=false",
//             "Referer": "https://app.utrsports.net/",
//             "Referrer-Policy": "strict-origin-when-cross-origin"
//         },
//         "body": null,
//         "method": "GET"
//     };
    
//     async function fetchData() {
//         try {
//             const response = await fetch(urlProfileInfo, optionsProfile);
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             const data = await response.json();
//             return data;  // Return the JSON object directly
//         } catch (error) {
//             console.error('There has been a problem with your fetch operation:', error);
//             return null;  // Return null in case of an error
//         }
//     }

//     var array = [["Full Name"],["Singles Rating"],["Doubles Rating"]];

//     let data = await fetchData()
    
//     if (data) {
//         array[0].push(data.displayName);
//         array[1].push(data.singlesUtr);
//         array[2].push(data.doublesUtr);
//     } else {
//         console.log('No available data');
//     }
    
//     return array;
// }

// let profileID = '2802438';
// GetPlayerUTRbyID(profileID).then(output => {
//     console.log(output);
// })
