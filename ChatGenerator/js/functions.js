﻿let streamerName = "MathewWilliamsMEDIA";
let width = 1400;
let height = 600;
let down = 150;
let toTheRight = 100;
let broadcastId;
let userId;
let error = false;

//User Colors:
let savedUsers = [];


//Features Customizable Set
//Basics Settings
let padding = 15;
let fontSize = 13;
let fontFamily = 'Normal';
let normalFontColor;
let letterSpacing = 0;
let wordSpacing = 0;
let basicFontColor = '#000000';
//Basic Chat
let bCFontWeight = 400;
let bcIcons = 'None';
let bcColors = [];
let bcIterator = 0;
//Moderators
let modFontWeight = 400;
let modIcons = 'None';
let modColors = [];
//Subscribers
let subFontWeight = 400;
let subIcons = 'None';
let subColors = [];
//SuperChat
let supFontWeight = 400;
let supIcons = 'None';
let supColors = [];
let borderThickness = 5;
let borderColor = '#CCCCCC';
let borderStyle = 'None';
//Stuff to block
let blockInvites = false;
let blockCaptures = false;
let blockFan = false;
let blockHashtags = false;

let goodies;
let chatBoxes = [];

//Random Setences
var verbs, nouns, adjectives, adverbs, preposition;
nouns = ["bird", "clock", "boy", "plastic", "duck", "teacher", "old lady", "professor", "hamster", "dog"];
verbs = ["kicked", "ran", "flew", "dodged", "sliced", "rolled", "died", "breathed", "slept", "killed"];
adjectives = ["beautiful", "lazy", "professional", "lovely", "dumb", "rough", "soft", "hot", "vibrating", "slimy"];
adverbs = ["slowly", "elegantly", "precisely", "quickly", "sadly", "humbly", "proudly", "shockingly", "calmly", "passionately"];
preposition = ["down", "into", "up", "on", "upon", "below", "above", "through", "across", "towards"];

//------------------------------------- BASICS -----------------------------------//
async function RunCode()
{
    startEventListeners ();
    DownloadGifts ();
    FetchBroadcastId ();
}

async function DownloadGifts()
{
    console.log ("Fetching Gifts...");
    targetUrl = 'https://ynassets.younow.com/giftsData/live/de/data.json';
    var json = fetch (targetUrl)
        .then (blob => blob.json ())
        .then (data =>
        {
            json = JSON.stringify (data, null, 2);
            goodies = JSON.parse (json);
        });
}

async function Retry()
{
    console.log ("Retrying in 5 seconds");
    await sleep (5000);
    error = false;
    FetchBroadcastId ();
}

async function FetchBroadcastId()
{
    console.log ("Fetching Broadcast....");
    var proxyUrl = 'https://younow-cors-header.herokuapp.com/?q=',
        targetUrl = 'https://api.younow.com/php/api/broadcast/info/curId=0/user=' + streamerName;
    var json = fetch (proxyUrl + targetUrl)
        .then (blob => blob.json ())
        .then (data =>
        {
            json = JSON.stringify (data, null, 2);
            var done = JSON.parse (json);
            if (json.length < 1)
            {
                console.log ("No Data Found");
                error = true;
            } else if (done.errorCode != 0)
            {
                console.log ("User not online or not found");
                error = true;
            }
            if (error)
            {
                console.log ("Error Found Retrying")
                Retry ();
                return;
            } else
            {
                userId = done.userId;
                broadcastId = done.broadcastId;
                console.log ("Data Found");
                FetchEvent ();
                return;
            }
        })
        .catch (e =>
        {
        });
}

function FetchEvent()
{
    //First Startup Connection:
    console.log ("Succesfully Connected to WebSocket");
    var pusher = new Pusher ('d5b7447226fc2cd78dbb', {
        cluster: "younow"
    });
    var channel = pusher.subscribe ("public-channel_" + userId);


    channel.bind ('onChat', function (data)
    {
        if (data.message !== "undefined")
        {
            console.log (data);
            let nickName = data.message.comments[0].name;
            let input = data.message.comments[0].comment;
            let id = data.message.comments[0].userId;
            let shouldSend = true;

            if (blockFan)
            {
                if (input.includes ("I became a fan!"))
                    shouldSend = false;
            }
            if (blockHashtags)
            {
                if (input.includes ('#'))
                    shouldSend = false;
            }
            if (blockCaptures)
            {
                if (input.includes ("captured a moment of"))
                    shouldSend = false;
            }
            if (blockInvites)
            {
                if (input.includes ("to this broadcast"))
                    shouldSend = false;
            }
            if (shouldSend) AddToChat (input, nickName, 'basic', id)
        }
    });

}


//-------------------------------- Animations --------------------------------//

function AddToChat(input, nickName, role, id, streamerId, crownsAmount)
{
    //First we create a test element for the height so i can set the height of the image the same, this is very hacky cus i don't care about js
    let testProduct = document.createElement("div");


    let mainPanel = document.getElementById ("MainPanel");
    let newChatBox = document.createElement ("div");
    let maxPanelHeight = mainPanel.offsetHeight;
    newChatBox.style.fontFamily = fontFamily;
    newChatBox.style.width = document.getElementById ("chatWidth").value;
    newChatBox.style.position = "absolute";
    newChatBox.style.bottom = "0px";
    newChatBox.style.animation = document.getElementById ("dropDownAnimationSelection").innerText;
    newChatBox.style.animationDuration = "1.0s";
    newChatBox.style.letterSpacing = letterSpacing;
    newChatBox.style.wordSpacing = wordSpacing;
    newChatBox.style.color = basicFontColor;
    newChatBox.style.fontSize = fontSize;
    newChatBox.id = uuidv4 ();
    newChatBox.style.display = "inline";

    let nickNameBox = document.createElement ("div");
    nickNameBox.style.display = "inline";
    nickNameBox.innerText = nickName + ': \n';
    let textBox = document.createElement ("div");
    textBox.style.display = "inline";
    textBox.innerText = input;


    // Switch for the Roles
    //Roles get weighted like this: Mod < Sub < Normal

    switch (role)
    {
        case('basic'):
            //Font weight
            newChatBox.style.fontWeight = getFontWeight (bCFontWeight);
            //Colors
            if (bcColors.length > 0)
            {
                let randNum = Number.parseInt (randomNumber (0, bcColors.length));
                nickNameBox.style.color = bcColors[randNum];
            }
            //Normal One
            break;
        case('subs'):
            newChatBox.style.fontWeight = getFontWeight (subFontWeight);
            if (subColors.length > 0)
            {
                let randNum = Number.parseInt (randomNumber (0, subColors.length));
                nickNameBox.style.color = subColors[randNum];
            }
            break;
        case('superChat'):
            newChatBox.style.fontWeight = getFontWeight (supFontWeight);
            if (supColors.length > 0)
            {
                let randNum = Number.parseInt (randomNumber (0, supColors.length));
                nickNameBox.style.color = supColors[randNum];
            }
            newChatBox.style.borderWidth = borderThickness;
            newChatBox.style.borderStyle = borderStyle;
            newChatBox.style.borderColor = borderColor;
            break;
        case('mods'):
            newChatBox.style.fontWeight = getFontWeight (modFontWeight);
            //Colors
            if (modColors.length > 0)
            {
                let randNum = Number.parseInt (randomNumber (0, modColors.length));
                nickNameBox.style.color = modColors[randNum];
            }
            break;
    }

    //---------------- TODO Should be redone
    let found = false;
    let foundColor = '';
    savedUsers.forEach (function (elem)
    {
        if (id === elem.id)
        {
            found = true;
            foundColor = elem.color;
        }
    });

    if (found)
    {
        nickNameBox.style.color = foundColor;
    } else
    {
        savedUsers.push (new UserWithColor (id, nickNameBox.style.color));
    }
    //---------------------
    document.getElementById ("MainPanel").append (newChatBox);


    document.getElementById (newChatBox.id).append (nickNameBox);
    document.getElementById (newChatBox.id).append (textBox);
    let lul = parseInt (document.getElementById (newChatBox.id).offsetHeight);
    console.log ('LUL SNACKED: ' + lul);
    document.getElementById(newChatBox.id).removeChild(nickNameBox);
    document.getElementById(newChatBox.id).removeChild(textBox);

        //Add Profile Picture if wanted:
    if (shouldAddPicture (role))
    {
        console.log (maxPanelHeight);
        let fillerDiv = document.createElement ("div");
        fillerDiv.style.width = "50px";
        fillerDiv.style.height = (lul + 10)+ "px";
        fillerDiv.style.float = "left";
        fillerDiv.style.marginRight = "7px";
        let profilePic = document.createElement ("div");
        profilePic.style.height = "50px";
        profilePic.style.width = "50px";
        profilePic.style.backgroundSize = 'contain';
        profilePic.style.borderRadius = '55%';
        profilePic.style.backgroundImage = "url(https://ynassets.younow.com/user/live/8026801/8026801.jpg)";

        fillerDiv.append (profilePic);
        document.getElementById (newChatBox.id).append (fillerDiv);

    }

    //This is were we add the icons
    switch (role)
    {
        case('basic'):
            if (shouldAddIcon (role))
                addIcon ('icons/Normal.png', newChatBox.id);
            break;
        case('subs'):
            if (shouldAddIcon (role))
                addIcon ('https://ynassets.younow.com/subscriptions/live/' + streamerId + '/1/badge.png', newChatBox.id);
            break;
        case('superChat'):
            //We don't do anything here
            break;
        case('mods'):
            if (shouldAddIcon (role))
                addIcon ('icons/Mod.png', newChatBox.id);
            break;
    }

    if (shouldAddIcon (role))
    {
        switch (crownsAmount)
        {
            case(0):
                break;
            default:
                addIcon ('icons/Crown' + crownsAmount + '.png', newChatBox.id);
                break;
        }
    }


    document.getElementById (newChatBox.id).append (nickNameBox);
    document.getElementById (newChatBox.id).append (textBox);
    chatBoxes.push (newChatBox);


    //This is for the chat to scroll up
    let newBoxSize = parseInt (newChatBox.offsetHeight);
    console.log ('TRUTH: ' + newBoxSize);
    for (let i = 0; i < chatBoxes.length; i++)
    {
        if (chatBoxes[i].getBoundingClientRect ().top < 70)
        {
            let elem = document.getElementById (chatBoxes[i].id);
            chatBoxes.splice (i, 1);
            mainPanel.removeChild (elem);
        }
    }

    //Iterate through array without changing the last one
    for (let i = 0; i < chatBoxes.length - 1; i++)
    {
        let convert = parseInt (chatBoxes[i].style.bottom);
        chatBoxes[i].style.bottom = (Number.parseInt (padding) + convert + newBoxSize) + "px";
    }

}

function shouldAddPicture(role)
{
    //Icon
    switch (role)
    {
        case 'basic':
            if (bcIcons.localeCompare ('Icons and Profile Pictures') === 0 || bcIcons.localeCompare ('Profile Pictures') === 0)
                return true;
            break;
        case 'subs':
            if (subIcons.localeCompare ('Icons and Profile Pictures') === 0 || supIcons.localeCompare ('Profile Pictures') === 0)
                return true;
            break;
        case 'superChat':
            if (supIcons.localeCompare ('Profile Pictures') === 0)
                return true;
            break;
        case 'mods':
            if (modIcons.localeCompare ('Icons and Profile Pictures') === 0 || modIcons.localeCompare ('Profile Pictures') === 0)
                return true;
            break;
        default:
            return false;
    }
    return false;
}

function shouldAddIcon(role)
{

    //Icon
    switch (role)
    {
        case 'basic':
            if (bcIcons.localeCompare ('Icons and Profile Pictures') === 0 || bcIcons.localeCompare ('Icons') === 0)
                return true;
            break;
        case 'subs':
            if (subIcons.localeCompare ('Icons and Profile Pictures') === 0 || bcIcons.localeCompare ('Icons') === 0)
                return true;
            break;
        case 'mods':
            if (modIcons.localeCompare ('Icons and Profile Pictures') === 0 || bcIcons.localeCompare ('Icons') === 0)
                return true;
            break;
        default:
            return false;
    }
    return false;
}

function setName(name)
{
    streamerName = name;
}

function ChangeChatWidth(i)
{
    let elem = document.getElementById ('MainPanel');
    elem.style.width = i + 'px';
}

function startEventListeners()
{
    //Event Listener for Chatwidth
    document.getElementById ("chatWidth").addEventListener ("change", function ()
    {
        ChangeChatWidth (this.value);
    })

    //Event Listener for changing Font
    let elements = document.getElementsByClassName ("fontSelection");

    let changeFont = function ()
    {
        document.getElementById ('dropDownFont').innerText = this.innerText;
        fontFamily = this.style.fontFamily;
    };

    for (let i = 0; i < elements.length; i++)
    {
        elements[i].addEventListener ('click', changeFont, false);
    }

    //Event Listener for changing Font
    let animationElements = document.getElementsByClassName ("dropDownAnimationSelection");

    let changeAnimation = function ()
    {
        document.getElementById ('dropDownAnimationSelection').innerText = this.innerText;
    };

    for (let i = 0; i < animationElements.length; i++)
    {
        animationElements[i].addEventListener ('click', changeAnimation, false);
    }

    //Eventlistener for padding
    document.getElementById ("padding").addEventListener ("change", function ()
    {
        padding = this.value;
    })

    //For fontsize
    document.getElementById ("fontSize").addEventListener ("change", function ()
    {
        fontSize = this.value;
    })

    //For fontsize
    document.getElementById ("fontSize").addEventListener ("change", function ()
    {
        fontSize = this.value;
    })


    let dropDownElements = document.getElementsByClassName ("dropDownItem");

    function changeElementFonts(elem)
    {
        elem.parentElement.parentElement.children[0].innerText = elem.innerText;

        switch (elem.parentElement.id)
        {
            case 'bcChatWeight':
                supFontWeight = elem.innerText;
                break;

            case 'bcIcon':
                bcIcons = elem.innerText;
                break;

            case 'subChatWeight':
                subFontWeight = elem.innerText;
                break;

            case 'subIcon':
                subIcons = elem.innerText;
                break;

            case 'modChatWeight':
                modFontWeight = elem.innerText;
                break;

            case 'modIcon':
                modIcons = elem.innerText;
                break;

            case 'superChatWeight':
                supFontWeight = elem.innerText;
                break;

            case'superIcon':
                supIcons = elem.innerText;
                break;

            case'borderStyle':
                borderStyle = elem.innerText;
                break;

            case'borderWidth':
                borderThickness = elem.innerText;
                break;


            default:
                console.log ('Couldn\'t find id: ' + elem.parentElement.id);
        }

    };

    for (let i = 0; i < dropDownElements.length; i++)
    {
        dropDownElements[i].addEventListener ('click', function ()
        {
            changeElementFonts (dropDownElements[i])
        }, false);
    }
}


function addIcon(url, chatBoxId)
{
    let icon = document.createElement ("div");
    icon.style.height = "15px";
    icon.style.width = "15px";
    icon.style.marginTop = "2px";
    icon.style.backgroundSize = 'contain';
    icon.style.float = 'left';
    icon.style.marginRight = '2px';
    icon.style.backgroundImage = "url(" + url + ")";

    document.getElementById (chatBoxId).append (icon);

}

//----------------------------- Additional Functions -----------------------------------------//

function sleep(milliseconds)
{
    return new Promise (resolve => setTimeout (resolve, milliseconds));
}

function ResetChat()
{
    let mainPanel = document.getElementById ('MainPanel');
    for (let i = 0; i < chatBoxes.length; i++)
    {
        let elem = document.getElementById (chatBoxes[i].id);
        mainPanel.removeChild (elem);
    }
    chatBoxes = [];
}

function randGen()
{
    return Math.floor (Math.random () * 5);
}

function randomNumber(min, max)
{
    return Math.random () * (max - min) + min;
}

function allEmojis()
{
    return /\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67)\uDB40\uDC7F|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC68(?:\uD83C\uDFFF\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFE])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFC-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|[\u2695\u2696\u2708]\uFE0F|\uD83D[\uDC66\uDC67]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708])\uFE0F|\uD83C\uDFFF|\uD83C\uDFFE|\uD83C\uDFFD|\uD83C\uDFFC|\uD83C\uDFFB)?|\uD83E\uDDD1(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83E\uDD1D\u200D\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69])(?:\uD83C[\uDFFB-\uDFFE])|\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69])(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69])(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69])(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83D\uDC69\uD83C\uDFFB\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69])(?:\uD83C[\uDFFC-\uDFFF])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|\uD83C\uDFF3\uFE0F\u200D\u26A7|\uD83E\uDDD1(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|\uD83D\uDC3B\u200D\u2744|(?:(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\uD83C\uDFF4\u200D\u2620|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])\u200D[\u2640\u2642]|[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u2328\u23CF\u23ED-\u23EF\u23F1\u23F2\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB\u25FC\u2600-\u2604\u260E\u2611\u2618\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u2692\u2694-\u2697\u2699\u269B\u269C\u26A0\u26A7\u26B0\u26B1\u26C8\u26CF\u26D1\u26D3\u26E9\u26F0\u26F1\u26F4\u26F7\u26F8\u2702\u2708\u2709\u270F\u2712\u2714\u2716\u271D\u2721\u2733\u2734\u2744\u2747\u2763\u2764\u27A1\u2934\u2935\u2B05-\u2B07\u3030\u303D\u3297\u3299]|\uD83C[\uDD70\uDD71\uDD7E\uDD7F\uDE02\uDE37\uDF21\uDF24-\uDF2C\uDF36\uDF7D\uDF96\uDF97\uDF99-\uDF9B\uDF9E\uDF9F\uDFCD\uDFCE\uDFD4-\uDFDF\uDFF5\uDFF7]|\uD83D[\uDC3F\uDCFD\uDD49\uDD4A\uDD6F\uDD70\uDD73\uDD76-\uDD79\uDD87\uDD8A-\uDD8D\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA\uDECB\uDECD-\uDECF\uDEE0-\uDEE5\uDEE9\uDEF0\uDEF3])\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83D\uDC15\u200D\uD83E\uDDBA|\uD83D\uDC69(?:\uD83C\uDFFF|\uD83C\uDFFE|\uD83C\uDFFD|\uD83C\uDFFC|\uD83C\uDFFB)?|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF6\uD83C\uDDE6|\uD83C\uDDF4\uD83C\uDDF2|\uD83D\uDC08\u200D\u2B1B|\uD83D\uDC41\uFE0F|\uD83C\uDFF3\uFE0F|\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])?|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|[#\*0-9]\uFE0F\u20E3|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])|\uD83C\uDFF4|(?:[\u270A\u270B]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD7A\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0C\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270C\u270D]|\uD83D[\uDD74\uDD90])(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])|[\u270A\u270B]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC08\uDC15\uDC3B\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD7A\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0C\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2-\uDDD5]|\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD]|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF]|[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF84\uDF86-\uDF93\uDFA0-\uDFC1\uDFC5\uDFC6\uDFC8\uDFC9\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC07\uDC09-\uDC14\uDC16-\uDC3A\uDC3C-\uDC3E\uDC40\uDC44\uDC45\uDC51-\uDC65\uDC6A\uDC79-\uDC7B\uDC7D-\uDC80\uDC84\uDC88-\uDCA9\uDCAB-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDDA4\uDDFB-\uDE44\uDE48-\uDE4A\uDE80-\uDEA2\uDEA4-\uDEB3\uDEB7-\uDEBF\uDEC1-\uDEC5\uDED0-\uDED2\uDED5-\uDED7\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB]|\uD83E[\uDD0D\uDD0E\uDD10-\uDD17\uDD1D\uDD20-\uDD25\uDD27-\uDD2F\uDD3A\uDD3F-\uDD45\uDD47-\uDD76\uDD78\uDD7A-\uDDB4\uDDB7\uDDBA\uDDBC-\uDDCB\uDDD0\uDDE0-\uDDFF\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6]/g;
}

function uuidv4()
{
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace (/[xy]/g, function (c)
    {
        var r = Math.random () * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString (16);
    });
}

function updateColors(role)
{
    switch (role)
    {
        case('basic'):
            let a = document.getElementById ('colorAdder');
            bcColors = [];
            for (let i = 0; i < a.children.length; i++)
            {
                bcColors.push (a.children[i].value);
            }
            break;
        case('subscribers'):
            let b = document.getElementById ('subColorAdder');
            subColors = [];
            for (let i = 0; i < b.children.length; i++)
            {
                subColors.push (b.children[i].value);
            }
            break;
        case('mods'):
            let m = document.getElementById ('modColorAdder');
            modColors = [];
            for (let i = 0; i < m.children.length; i++)
            {
                modColors.push (m.children[i].value);
            }
            break;
        case('superChat'):
            let s = document.getElementById ('superColorAdder');
            supColors = [];
            for (let i = 0; i < s.children.length; i++)
            {
                supColors.push (s.children[i].value);
            }
            break;
        case('Grid'):
        {
            borderColor = document.getElementById ('borderColor').value;
        }
    }
}


function addColor(elemId, role)
{
    let elem = document.getElementById (elemId);
    let newColor = document.createElement ("input");
    newColor.setAttribute ("type", "color");
    newColor.addEventListener ('change', function ()
    {
        updateColors (role)
    }, false);
    newColor.style.width = '40px';
    newColor.style.height = '40px';
    elem.append (newColor);
    updateColors (role);
}

function removeColor(elemId, role)
{
    let elem = document.getElementById (elemId);
    if (elem.lastElementChild != null) elem.removeChild (elem.lastElementChild);
    updateColors (role);
}

function resetSettings()
{
    document.getElementById ('basicPreferences').style.display = 'none';
    document.getElementById ('basicChat').style.display = 'none';
    document.getElementById ('subscriber').style.display = 'none';
    document.getElementById ('mods').style.display = 'none';
    document.getElementById ('superChat').style.display = 'none';
    document.getElementById ('whatToShow').style.display = 'none';

}

function showFolder(name)
{
    resetSettings ();
    switch (name)
    {
        case('Basic Preferences'):
            document.getElementById ('basicPreferences').style.display = 'block';
            break;
        case('Basic Chat'):
            document.getElementById ('basicChat').style.display = 'block';
            break;
        case('Subscribers'):
            document.getElementById ('subscriber').style.display = 'block';
            break;
        case('Mods'):
            document.getElementById ('mods').style.display = 'block';
            break;
        case('SuperChat'):
            document.getElementById ('superChat').style.display = 'block';
            break;
        case('Icons'):
            document.getElementById ('icons').style.display = 'block';
            break;
        case('What to Block'):
            document.getElementById ('whatToShow').style.display = 'block';
            break;
    }


}

function setBlocks(elem)
{
    switch (elem.id)
    {
        case 'showInvites':
            blockInvites = elem.checked;
            break;
        case 'showCaptures':
            blockCaptures = elem.checked;
            break;
        case 'showFan':
            blockFan = elem.checked;
            break;
        case 'showHashtags':
            blockHashtags = elem.checked;
            break;
    }
}


function setLetterSpacing(elem)
{
    letterSpacing = elem;
}

function setWordSpacing(elem)
{
    wordSpacing = elem;
}

function setBasicFontColor(elem)
{
    basicFontColor = elem;
}

function AddChat(role, id)
{
    let randomNum = randomNumber (0, 1000);
    var rand1 = Math.floor (Math.random () * 10);
    var rand2 = Math.floor (Math.random () * 10);
    var rand3 = Math.floor (Math.random () * 10);
    var rand4 = Math.floor (Math.random () * 10);
    var rand5 = Math.floor (Math.random () * 10);
    var rand6 = Math.floor (Math.random () * 10);
    var content = "The " + adjectives[rand1] + " " + nouns[rand2] + " " + adverbs[rand3] + " " + verbs[rand4] + " because some " + nouns[rand1] + " " + adverbs[rand1] + " " + verbs[rand1] + " " + preposition[rand1] + " a " + adjectives[rand2] + " " + nouns[rand5] + " which, became a " + adjectives[rand3] + ", " + adjectives[rand4] + " " + nouns[rand6] + ".";
    AddToChat (content, 'TestUserName', role, randomNum, 7081785, 1);
}

function getFontWeight(elem)
{
    switch (elem)
    {
        case('Light'):
            return 300;
            break;
        case('Medium'):
            return 600;
            break;
        case('Bold'):
            return 900;
            break;
    }
}

function UserWithColor(id, color)
{
    this.id = id;
    this.color = color;
}
