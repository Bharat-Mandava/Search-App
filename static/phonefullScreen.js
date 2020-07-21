//import 'regenerator-runtime/runtime';
//import axios from 'axios';

const search = document.getElementById('search')
const matchList = document.getElementById('match-list')
const trendingList = document.getElementById('trending-list')
const appTitle = document.getElementById('app-Title')
const baseContainer = document.getElementById('base-container');
var selectedSuggestionIndex = -1;

//Initial Suggestions
const getCountriuesWithBlank = async (e) => {
    appTitle.style.display = "none";
    baseContainer.style.padding = "0"
    if (!matchList.innerHTML) {
        let matches = ["Ind", "US", "IT", "FR", "NR"]
        outputHtmlHistory(matches);
    }
}

//case 2 : fetch data from server
const getcountries = async searchText => {
    if (searchText.length < 1) {
        console.log(searchText.length)
        let matches = ["Ind", "US", "IT", "FR", "NR"]
        outputHtmlHistory(matches)
        return
    }
    selectedSuggestionIndex = -1;
    console.log(searchText);
    const res = await axios.get(`/countrycode?name=${searchText}`);
    const country = res.data;
    console.log(country)
    if (country) {
        outputHtml(country);
    }
    renderNoResults();
};

const renderNoResults = () => {
    let noSuggestions = "";
    outputHtml(noSuggestions);
    matchList.innerHTMl = "";
}

// //render results in HTML
const outputHtml = (matches) => {
    matchList.style.display = "flex"
    if (matches.length > 0) {
        const html = matches.map((match) => `
                <div class="searchContainer"><i class="fas fa-search" style="padding-left: 23px"></i>
                <div style="width:70vw" class="spanContent">${match.country_code}<br><span style="font-size:13px; display: ${match.imgURL === "0" ? "none" : "block"}">This is a country</span>
                </div>
                <img style="height:30px; padding: 10px; display: ${match.imgURL === "0" ? "none" : "block"}"src='${match.imgURL}'>
                </div>
            `).join('');
        matchList.innerHTML = html;
    }
};

// //render results in HTML
// const outputHtml = (matches, imgUrl) => {
//     matchList.style.display = "flex"
//     if (matches.length > 0) {
//         const html = [];
//         console.lo
//         for (let i = 0; i < matches.length; i++) {
//             let x = `
//             <div class="searchContainer"><i class="fas fa-search" ></i>
//             <div style="width:100%" class="spanContent">${matches[i]}</div>
//             <img style="height:30px; padding: 10px"src=${imgUrl[i]}>
//             </div>`
//             html.push(x);
//         }
//         html.join('');
//         // const html = matches.map((match) => `
//         //     <div class="searchContainer"><i class="fas fa-search" ></i>
//         //     <div style="width:100%" class="spanContent">${match}</div>
//         //     <img style="height:30px; padding: 10px"src=${imgUrl}>
//         //     </div>
//         // `).join('');
//         matchList.innerHTML = html;
//     }
// };

//populate search results with history data
const outputHtmlHistory = matches => {
    matchList.style.display = "flex";
    if (matches.length > 0) {
        const html = matches.map(match => `
            <div class="searchContainerHistory">
            <i class='far fa-clock'></i> <div style="width:100%" class="spanContent">${match}</div>
            <div class="fullremoveHistoryButton">Remove</div>
            <div class="shortremoveHistoryButton">X</div>
            </div>
        `).join('');
        matchList.innerHTML = html;
    }
}

//populate Trending Values
const outputTrending = trendingValues => {
    const html = trendingValues.map(value => `
    <div class="card">${value}</div>
    `).join('');
    trendingList.innerHTML = html;
};


//EventListener to select the options from the List
document.addEventListener('click', function (e) {
    matchList.style.display = "flex";
    if (e.target.className == 'spanContent') {
        search.value = e.target.innerHTML;
    }
    if (e.target.className == 'spanContent') {
        search.value = e.target.innerHTML;
    }
    if (e.target.className !== "searchBar") {
        matchList.style.display = "none";
    }
});

//EventListener to remove history
document.addEventListener('click', function (e) {
    if (e.target.className == 'fullremoveHistoryButton' || e.target.className == 'shortremoveHistoryButton') {
        let confirmation = confirm("Removing this will remove this recent search from your history on all your devices");
        if (confirmation == true) {
            console.log('helloremove')
            e.target.parentElement.remove()
            matchList.style.display = "flex";
            event.preventDefault()
        }
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
        console.log(selectedSuggestionIndex)
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
    console.log(trendingValues);
    if (trendingValues) {
        outputTrending(trendingValues);
    }
};

//eventListeners
search.addEventListener('input', () => getcountries(search.value));
search.addEventListener('click', () => getCountriuesWithBlank());
//Load Trending on window load
window.addEventListener('load', () => getTrending())