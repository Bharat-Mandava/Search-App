//import 'regenerator-runtime/runtime';
//import axios from 'axios';
//import * as flags from "./asset.js"
import * as i118n from "./intl.js"
const search = document.getElementById('search')
const matchList = document.getElementById('match-list')
const trendingList = document.getElementById('trending-list')
const signout = document.getElementById('signoutButton')
var selectedSuggestionIndex = -1;
let overlayme = document.getElementById("dialog-container");
let popupQuestion = document.getElementById("popupQuestion");

let initialHistory = async () => {
    let ih = await callHistory();
    console.log(ih)
    return ih;
};


//remove duplicates from the array
function removeDuplicates(data) {
    return data.filter((value, index) => data.indexOf(value) === index);
}


function onSignIn() {
    const googleUser = gapi.auth2.getAuthInstance().currentUser.get();
    let profile = googleUser.getBasicProfile();
    let id = profile.getId();
    let email = profile.getEmail();
    signout.style.display = "block"
    let userData = [id, email]
    signout.style.display = 'block'
    if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
        console.log(`user logged in`)
        signout.style.display = 'block'
    }
    // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    // console.log('Name: ' + profile.getName());
    // console.log('Image URL: ' + profile.getImageUrl());
    // console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    return userData
}

const callHistory = async () => {
    let history;
    let userData = onSignIn();
    let userId = userData[0]
    console.log(userData, userId)
    const res = await axios.get(`/history?id=${userId}`);
    let data = res.data;
    if (data.length < 1) {
        return
    }
    history = data.map(e => e.history);
    return history
    // let statesHistory = removeDuplicates(history[0].history.split(','));
    // return statesHistory;
    //  const res = await axios.get(`/history?id=0`);
    // history = res.data;
    // let statesHistory = removeDuplicates(history[0].history.split(','));
    // return statesHistory;
}


//cookie setup and update
function setCookies(cvalue,) {
    document.cookie = "userInput" + '=' + cvalue + "; expires=Thu, 31 Dec 2037 12:00:00 GMT';"
}
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

//Initial Suggestions
const getCountriuesWithBlank = async (e) => {
    if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
        let historymatches = await callHistory();
        //let historyValues = getCookie("userInput");
        //matches = getCookie("userInput");
        if (typeof historymatches !== 'undefined') {
            outputHtmlHistory(historymatches);
        }
    }
};

//case 2 : fetch data from server
const getcountries = async searchText => {
    if (searchText.length < 1) {
        let matches = await callHistory();
        outputHtmlHistory(matches)
        return;
    };
    let suggestions = [];
    selectedSuggestionIndex = -1;
    const res = await axios.get(`/countrycode?name=${searchText}`);
    const country = res.data;
    suggestions = country.map(e => e.country_code);
    if (suggestions) {
        outputHtml(suggestions);
    };
    renderNoResults();
};

const renderNoResults = () => {
    let noSuggestions = "";
    outputHtml(noSuggestions);
    matchList.innerHTMl = "";
}

//render results in HTML
const outputHtml = matches => {
    matchList.style.display = "flex"
    if (matches.length > 0) {
        const html = matches.map(match => `
            <div class="searchContainer"><i class="fas fa-search" ></i>
            <div style="width:100%" class="spanContent">${match}</div></div>
        `).join('');
        matchList.innerHTML = html;
    }
}

//populate search results with history data
const outputHtmlHistory = matches => {
    matchList.style.display = "flex";
    if (matches.length > 1) {
        let html = matches.map(match => `
            <div class="searchContainerHistory">
            <i class='far fa-clock'></i> <div style="width:100%" class="spanContent">${match}</div>
            <div class="fullremoveHistoryButton">Remove</div>
            <div class="shortremoveHistoryButton">X</div>
            </div>
        `).join('');
        matchList.innerHTML = html;
        return
    }
    let html = `
        <div class="searchContainerHistory">
        <i class='far fa-clock'></i> <div style="width:100%" class="spanContent">${matches[0]}</div><div class="fullremoveHistoryButton">Remove</div>
        <div class="shortremoveHistoryButton">X</div>
        </div>
    `;
    matchList.innerHTML = html;
}

//populate Trending Values
const outputTrending = trendingValues => {
    const html = trendingValues.map(value => `<div class="card">${value}</div >`).join('');
    trendingList.innerHTML = html;
};


//EventListener to select the options from the List
document.addEventListener('click', async (e) => {
    matchList.style.display = "flex";
    if (e.target.className == 'spanContent') {
        search.value = e.target.innerHTML;
        setCookies(search.value);
        //let historyFromDb = await initialHistory()
        // historyFromDb.unshift(search.value);
        let historyFromDb = e.target.innerHTML;
        if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
            let userData = onSignIn();
            saveHistoryToDB(historyFromDb, userData)
        }
        // if (gapi.auth2.getAuthInstance().isSignedIn.get() == false) {
        //     let userId = 0;
        //     console.log(historyFromDb)
        // }
    }
    if (e.target.className == 'spanContent') {
        search.value = e.target.innerHTML;
    }
    if (e.target.className !== "searchBar") {
        matchList.style.display = "none";
    }
});


// // Method 1: confirm alert box to remove history
// const confirmation = async removingValue => {
//     overlayme.style.display = "block";
//     popupQuestion.textContent = `Removing ${removingValue} will remove this search from your history on all your devices`;
//     return new Promise(function (resolve, reject) {
//         document.getElementById("confirm").onclick = function confirmOutPut() {
//             overlayme.style.display = "none";
//             let answer = true;
//             console.log(`true${answer}`)
//             resolve(answer)
//         }
//         document.getElementById("cancel").onclick = function cancel() {
//             overlayme.style.display = "none";
//             let answer = false;
//             console.log(`false${answer}`)
//             reject(answer)
//         }
//     });
// }


//Method 2 : confirm alert box to remove history
const confirmation = (removingValue, keyPressLocation) => {
    overlayme.style.display = "block";
    popupQuestion.textContent = `Removing ${removingValue} will remove this search from your history on all your devices`;
    document.getElementById("confirm").onclick = function confirmOutPut() {
        overlayme.style.display = "none";
        keyPressLocation.parentElement.remove()
        matchList.style.display = "flex";
        if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
            let userData = onSignIn();
            removeSearches(removingValue, userData)
        }
    }
    document.getElementById("cancel").onclick = function cancel() {
        overlayme.style.display = "none";
    }
}

//EventListener to remove history
document.addEventListener('click', async function (e) {
    if (e.target.className == 'fullremoveHistoryButton' || e.target.className == 'shortremoveHistoryButton') {
        let keyPressLocation = e.target;
        let removingValue = e.target.previousElementSibling.innerHTML;
        confirmation(removingValue, keyPressLocation);
        return
    }
});

function resetSelectedSuggestion() {
    for (var i = 0; i < matchList.children.length; i++) {
        matchList.children[i].classList.remove('selected');
    }
}
//EventListener for arrowkeys on the suggestions
search.addEventListener("keydown", function (e) {
    var x = document.getElementById("match-list");
    if (e.key == 'ArrowDown') {
        resetSelectedSuggestion()
        selectedSuggestionIndex = (selectedSuggestionIndex < matchList.children.length - 1) ? selectedSuggestionIndex + 1 : matchList.children.length - 1;
        x.children[selectedSuggestionIndex].classList.add('selected');
        search.value = matchList.children[selectedSuggestionIndex].children[1].innerHTML;
        e.preventDefault();
        return;
    }
    if (e.key == 'ArrowUp') {
        resetSelectedSuggestion()
        selectedSuggestionIndex = (selectedSuggestionIndex > 0) ? selectedSuggestionIndex - 1 : 0;
        x.children[selectedSuggestionIndex].classList.add('selected');
        search.value = matchList.children[selectedSuggestionIndex].children[1].innerHTML;
        // selectedSuggestionIndex = -1;
        e.preventDefault();
        return;
    }
    if (e.key == 'Enter') {
        event.preventDefault()
        search.value = matchList.children[selectedSuggestionIndex].children[1].innerHTML;
        selectedSuggestionIndex = -1;
        resetSelectedSuggestion()
        return;
    }
})

//getTrending values
const getTrending = async trending => {
    let trendingValues = [];
    // const res = await axios.get(`http://localhost:5000/`);
    trendingValues = ["USA", "FR", "NR", "IND", "CH", "GY"];
    if (trendingValues) {
        outputTrending(trendingValues);
    }
};


//remove history from DB
const removeSearches = async (historyData, userData) => {
    let historyDataObj = {
        history: historyData,
        gId: userData[0],
        email: userData[1]
    }
    let res = await axios.post(`/removehistory`, historyDataObj);
    console.log(`remove history call`)
};

//save/ post history and userid to DB
const saveHistoryToDB = async (historyData, userData) => {
    let historyDataObj = {
        history: historyData,
        gId: userData[0],
        email: userData[1]
    }
    let res = await axios.post(`/addcookie`, historyDataObj);
    console.log(`cookies post call`)
};

function signinaction() {
    //signout.style.display = 'block'
    if (gapi.auth2.getAuthInstance().isSignedIn.get() == true) {
        signout.style.display = 'block'
    }
}

//eventListeners
search.addEventListener('input', () => getcountries(search.value));
search.addEventListener('click', () => getCountriuesWithBlank());
//Load Trending on window load
window.addEventListener('load', () => getTrending())

//i18n initiation

