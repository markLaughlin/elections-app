const searchUrl = "https://api.open.fec.gov/v1/candidates/search/?sort_nulls_last=false&election_year=2020&per_page=20&sort=name&sort_null_only=false&office=P&page=1&api_key=qz9xwLZBL32E7X9FPi8NE9pfkcMdT5KKNSlRCW9e&sort_hide_null=false";
const searchUrlTwo = "https://newsapi.org/v2/top-headlines?";
const searchUrlTwoB = "&language=en&apiKey=204c40bf5c294174b8c293e3c95bb84b";
const searchUrlThree = "https://en.wikipedia.org/w/api.php?action=opensearch&limit=1&format=json&origin=*";
const searchUrlFour = "https://api.open.fec.gov/v1/candidates/totals/?api_key=qz9xwLZBL32E7X9FPi8NE9pfkcMdT5KKNSlRCW9e&page=1&election_full=false&sort_hide_null=false&sort_nulls_last=false&per_page=20&sort_null_only=false&candidate_id="

let sQuearyString = "";

let urlSOne = "";
let urlSTwo = "";
let urlSThree = "";
let urlSFour = "";

let id = "007"

let name = "noName";
let cash = 0;
let news = [];
let bio = "bioToCome";

let count = 0;

function firstBlock(){
    console.log("1: page loaded; firstBlock function ran");
    $("#inputOne").focus();

    $("#formOne").submit(function (event){
        event.preventDefault();
        console.log("the form was submitted");


        $("#displayAreaOne").empty();


        name = $("#inputOne").val();        
        getInfo(name);
        $("#inputOne").focus();

    });
}

function getInfo(name){
    console.log("2: getInfo function ran");

    sQuearyString = simpleURI(name);
    urlSOne = searchUrl + "&name=" + sQuearyString;
    urlSTwo = searchUrlTwo + "q=" + sQuearyString + searchUrlTwoB;
    urlSThree = searchUrlThree + "&search=" + sQuearyString;

    candidateFetch(urlSOne);
}

function simpleURI(n){
    console.log("3: simpleURI function ran");
    let qS = encodeURIComponent(n);
    console.log("Here is the simple queryString" + qS);
    return qS;
}

function candidateFetch(uO){
    console.log("4: candidateFetch function ran");
    fetch(uO)
        .then(function(response) {
            if (!response.ok) {
                throw Error(response.statusText);
            }
             return response;
        })
        .then(response => response.json())
        .then(responseJson => extractId(responseJson))        
        .catch(error => errorNotice());     

}

function extractId(r){
    console.log("5: extractId function ran")
    console.log(r.results[0].candidate_id);
    let id=r.results[0].candidate_id
    console.log("Here is the id again: " + id);
    secondBlock(id);  
}

function secondBlock(id){
    console.log("6: secondBlock function ran with id: " + id);
    urlSFour = searchUrlFour + id;
    console.log("Here is the urlSFour to go into fetch for fourth value: " + urlSFour);
    
    fetch(urlSFour)
    .then(function(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    })
    .then(response => response.json())
    .then(responseJson => getResults(responseJson))
    .catch(error => errorNotice()); 
}//getMoney

function getResults(r){
    console.log("7: getResults function starting to run");
    name = r.results[0].name;
    cash = r.results[0].cash_on_hand_end_period; 
    cash = formatNumber(cash); 
    console.log(name);
    console.log(cash);
    console.log("9: getResults function finished running after getting value from formatNumber function");
    thirdBlock();
}

function formatNumber(num) {
    console.log("8: formatNumber function ran");
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

  function thirdBlock(){
    console.log("10: thirdBlock function ran");
        fetch(urlSTwo)
        .then(function(response) {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response;
        })
     .then(response => response.json())
     .then(responseJson => getNews(responseJson))
     .catch(error => errorNotice()); 
    }

function getNews(r){
    console.log("11: getNews function ran");
    news = r.articles;
    console.log(news);
    fourthBlock();
}

function fourthBlock(){
    console.log("12: fourthBlock function ran");
    fetch(urlSThree)
     .then(function(response) {
         if (!response.ok) {
             throw Error(response.statusText);
         }
         return response;
     })
     .then(response => response.json())
     .then(responseJson => getBio(responseJson))
     .catch(error => errorNotice()); 

}

function getBio(r){
    console.log("13: function getBio ran");
    bio = r[2];
    bLink = r[3];
    
    display(name, cash, news, bio, bLink);
}

function display(name, cash, news, bio, bLink){

    console.log("14: display function ran");

        if(news.length == 0){
            newsTitleOne = "No recent top stories about this candidate; check later.";
            newsUrlOne = "null";
            dN = `<p><a>${newsTitleOne}</a></p>`
           
        } else {
        newsTitleOne = news[0].title;
        newsUrlOne = news[0].url;
        dN = `<p><a target="_blank" href="${newsUrlOne}">${newsTitleOne}</a></p>`
        }
         
    let results = 
    `
    <p id="anotherNotice">Enter another candidate name above!</p>

    <div id="outerContainer">

        <div id="containerOne">
            <strong>Campaign Cash</strong>
            Enter another candidate name above!
            <p>Presidential candidate ${name} has the following amount of cash on hand for their campaign (as registered with the FEC):</p>
            
            <p><strong>$${cash}</strong></p>
        </div>
        <div id="containerTwo">
            <strong>Recent news</strong>
            
            <p>${dN}</p>
          
        </div>
        <div id="containerThree">
            <strong>Biography</strong>
            
            <p>${bio}</p>
            <p><a href="${bLink}" target="_blank">Read More</a></p>
        </div>
    </div>
    <p></p>
    `
    $("#displayAreaOne").prepend(results);
    $("#inputOne").val("");
}

function errorNotice(){
    console.log("1B: function errorNotice ran");
    let errorDisplay =
    `
    <p id="error">
    Something went wrong! Check spelling and try different versions of first name (Example: "Joseph Biden" instead of "Joe Biden"). Maybe the candidate isn't registered with the FEC yet. Try again!
    </p>
    `
    $("#displayAreaOne").prepend(errorDisplay);
    $("#inputOne").val("");
}

$(firstBlock)