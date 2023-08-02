const guess = document.querySelector(".guess");
const guessList = document.querySelector(".guesses");
const cluesList = document.querySelector(".clues");
const def = document.querySelector(".definition");
const giveUpBtn = document.querySelector(".idkbtn");
// const infoBtn = document.querySelector(".infobtn");

const max = 10;
const min = 3;

var guessCount;

var myWord="";
var similarList = new Array();
var rhymeList = new Array();

const param = {
    headers: {
        'X-Api-Key': 'iqyInAiNKlF2ZsQqCtxAhg==45Rd9txHfMDSuoWZ',
        "Content-Type": "application/json"
    },
    method:"GET"
};

function storeSimilar(list){
    for (let index = 0; index < list.length; index++) {
        similarList[index] = list[index].word;
    }
    console.log("similar words: " + similarList);
}

function storeRhymes(list){
    for (let index = 0; index < list.length; index++) {
        rhymeList[index] = list[index].word;
    }
    console.log("rhymes: "+ rhymeList);
}

function storeWord(word)
{
    myWord = word;
    // var similarUrl = 'https://api.datamuse.com/words?rel_rhy='+myWord;
    var similarUrl = 'https://api.datamuse.com/words?ml='+myWord;
    // var similarUrl = 'https://api.datamuse.com/words?rel_spc='+myWord;
        fetch(similarUrl)
        .then(data=>{return data.json()})
        // .then(console.log(myWord))
        .then(res=>storeSimilar(res))
        .catch(error=>console.log(error));
    
    guess.disabled = false;

    getRhymes(myWord);
}

function genWord(){
    guess.disabled = true;
    // var randWordUrl = 'https://api.api-ninjas.com/v1/randomword';
    var randWordUrl = 'https://random-word-api.vercel.app/api?words=1'

    // var randWordUrl = 'https://random-word-api.herokuapp.com/word?length='+Math.floor(Math.random() * (max - min + 1) + min);
        fetch(randWordUrl)//, param)
        .then(data=>{return data.json()})
        .then(res=>dictionaryLookup(res[0]))
        .catch(error=>console.log(error));
    guessCount=0;
    cluesList.style.margin="0 0 0 0";
    cluesList.style.border = "none";
    guessList.style.border = "none";
}

function dictionaryLookup(word){
    var dictionaryUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en/'+word;
    // var dictionaryUrl = 'https://api.api-ninjas.com/v1/dictionary?word='+word
    fetch(dictionaryUrl)//, param)
    .then(data=>{return data.json()})
    .then(function(res){
        if(!res.title && word.length<=10){
            console.log("original word: "+word);
            console.log("simplified: "+res[0].sourceUrls[0].split("/wiki/").pop());
            storeWord(res[0].sourceUrls[0].split("/wiki/").pop());
            console.log("definition: "+res[0].meanings[0].definitions[0].definition);
            def.innerText=res[0].meanings[0].definitions[0].definition;
            // console.log(res.definition);
        }
        else genWord();
    })
    .catch(error=>console.log(error));
}

function getRhymes(word)
{
    var rhymeUrl = 'https://api.datamuse.com/words?rel_rhy='+word;
    // var similarUrl = 'https://api.datamuse.com/words?ml='+myWord;
    // var similarUrl = 'https://api.datamuse.com/words?rel_spc='+myWord;
        fetch(rhymeUrl)
        .then(data=>{return data.json()})
        // .then(console.log(myWord))
        .then(res=>storeRhymes(res))
        .catch(error=>console.log(error));
}

genWord();

function createListElem(text, color, size){
    var listElem = document.createElement("li");
    listElem.innerText=text;
    listElem.style.color=color;
    listElem.style.fontSize = size;
    guessList.prepend(listElem);
}

guess.addEventListener("keyup", e => {
    if(e.key === "Enter" && e.target.value)
    {
        guessList.style.border = "2px solid black";
        guessCount++;
        if
        (
            e.target.value == myWord ||
            e.target.value+"s" == myWord ||
            e.target.value+"es" == myWord ||
            e.target.value.slice(0, -1) + "ies" == myWord
        )
        {
            console.log("you guessed it!");
            createListElem(e.target.value,"#77dd77", "x-large");
            guess.value = "";
            guess.disabled = true;
            giveUpBtn.style.backgroundColor = "#77dd77";
            giveUpBtn.innerText = "give me another one";
            btnPressTimes=1;
            return;
        }
        var isItInTheList=0;
        similarList.forEach(word => {
            if(word == e.target.value){
                isItInTheList=1;
            }
        });
        if(isItInTheList)
        {
            console.log("that is related to the word");
            createListElem(e.target.value,"#ffb347", "medium");
        }
        else {
            console.log("that is not related to the word");
            createListElem(e.target.value,"#ff6961", "medium");
        }
        guess.value = "";


        if(guessCount%3==0 && guessCount%6!=0 || (guessCount%5==0 && rhymeList.length == 0))
        {
            cluesList.style.margin= "0px 0 10px 0";
            cluesList.style.border = "2px solid black";
            var listElem = document.createElement("li");
            listElem.innerText="the word could be similar to " + similarList[Math.floor(Math.random()*similarList.length)];
            listElem.style.color="#fdfd96";
            listElem.style.fontSize="larger";
            cluesList.prepend(listElem);
        }else if(guessCount%6==0 && rhymeList.length != 0)
        {
            var listElem = document.createElement("li");
            listElem.innerText="the word rhymes with " + rhymeList[Math.floor(Math.random()*rhymeList.length)];
            listElem.style.color="pink";
            listElem.style.fontSize="larger";
            cluesList.prepend(listElem);
        }
    }
});

var btnPressTimes = 0;

giveUpBtn.addEventListener("click", () => {
    btnPressTimes++;
    switch(btnPressTimes)
    {
        case 1:
            var listElem = document.createElement("li");
            listElem.innerText="The word was " + myWord + " :(";
            listElem.style.color="#ff6961";
            listElem.style.fontSize="large";
            guessList.prepend(listElem);
            guess.value = "";
            guess.disabled = true;
            giveUpBtn.style.backgroundColor = "#77dd77";
            giveUpBtn.innerText = "give me another one";
            break;
        case 2:
            btnPressTimes=0;
            genWord();
            giveUpBtn.style.backgroundColor = "#ff6961";
            giveUpBtn.innerText = "i give up";
            while (guessList.firstChild) {
                guessList.removeChild(guessList.firstChild);
            }
            while (cluesList.firstChild) {
                cluesList.removeChild(cluesList.firstChild);
            }
            break;
    }
})

// infoBtn.addEventListener("click", () => {
//     var listElem = document.createElement("li");
//     listElem.innerText="orange means it's similar to the word";
//     listElem.style.color="#ffb347";
//     listElem.style.fontSize="medium";
//     guessList.prepend(listElem);
//     var listElem = document.createElement("li");
//     listElem.innerText="red means it's not related to the word";
//     listElem.style.color="#ff6961";
//     listElem.style.fontSize="medium";
//     guessList.prepend(listElem);
// })