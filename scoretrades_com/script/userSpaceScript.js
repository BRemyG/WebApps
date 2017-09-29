/**
 * Created by RemyValery on 10/22/2016.
 */
/**
 * Created by n88047 on 10/20/2016.
 */

function chatTemplate(msg, name, picture){
// var msgTemplate = "<div class=\"row\">\n    <div class=\"col-sm-3\">\n    <div class=\"well\">\n    <p>"+ name +"</p>\n    <img src=\"../images/Sarah.png\" class=\"img-circle\" height=\"55\" width=\"55\" alt=\"Avatar\">\n    </div>\n   </div>\n    <div class=\"col-sm-9\">\n    <div class=\"well\">\n    <p>"+ msg +"</p></div></div>\n</div>"
    var msgTemplate = document.getElementById("msgTemplate");
    msgTemplate.content.getElementById("msgTxt").innerText = msg;
    msgTemplate.content.getElementById("msgName").innerText = name;
    return document.importNode(msgTemplate.content, true);
}
function updateMyPageTemplate(msg, name, image){
// var msgTemplate = "<div class=\"row\">\n    <div class=\"col-sm-3\">\n    <div class=\"well\">\n    <p>"+ name +"</p>\n    <img src=\"../images/Sarah.png\" class=\"img-circle\" height=\"55\" width=\"55\" alt=\"Avatar\">\n    </div>\n   </div>\n    <div class=\"col-sm-9\">\n    <div class=\"well\">\n    <p>"+ msg +"</p></div></div>\n</div>"
    var msgTemplate = document.getElementById("myPageTemplate");
    msgTemplate.content.getElementById("msgTxt").innerText = msg;
    msgTemplate.content.getElementById("msgName").innerText = name;
    msgTemplate.content.getElementById("searchedImage").getAttribute("src") = image;
    return document.importNode(msgTemplate.content, true);
}
function searchResult(msg, name, image, linkText, hyperLink){
// var msgTemplate = "<div class=\"row\">\n    <div class=\"col-sm-3\">\n    <div class=\"well\">\n    <p>"+ name +"</p>\n    <img src=\"../images/Sarah.png\" class=\"img-circle\" height=\"55\" width=\"55\" alt=\"Avatar\">\n    </div>\n   </div>\n    <div class=\"col-sm-9\">\n    <div class=\"well\">\n    <p>"+ msg +"</p></div></div>\n</div>"
    var msgTemplate = document.getElementById("searchResult");
    msgTemplate.content.getElementById("msgTxt").innerText = msg;
    msgTemplate.content.getElementById("msgName").innerText = name;
    msgTemplate.content.getElementById("searchLink").innerText = hyperLink;
    msgTemplate.content.getElementById("searchLink").getAttribute('href') = linkText;
    msgTemplate.content.getElementById("searchedImage").getAttribute("src") = image;
    return document.importNode(msgTemplate.content, true);
}

function send(){
    var ChatMsg = document.getElementById("chatTextMsg");
    var msg = ChatMsg.value;
    ChatMsg.value="";
    var chatElt = document.getElementById("chat");
    chatElt.appendChild(chatTemplate(msg,"Sarah"));
}
function sendWithEnter(e){
    // monitor keystrokes. Send when keystroked is the 'Enter' key , code 13.
    var code =(e.keyCode ? e.keyCode : e.which);
    if (code==13) send();
    // console.log("keycode: "+ code)

}
function slideChat(){
    var visibility  = document.getElementById("chatText").style.visibility
    document.getElementById("chatText").style.visibility = (visibility=="hidden")? "visible": "hidden";
}
function incrementLike(){
    var likes = document.getElementById("likeButton");
    console.log(likes.innerText);
}

function load(){
 //   $("#loadTips").load("http://localhost:81/loadTips")
    $(document).ready(function(){
        $("#loadTips").click(function(){
            $("#loadTips").load("http://localhost:81/loadTips");
        })
    })

}
//load();

function xhrLoad(){
    var xhr = new XMLHttpRequest();
    console.log(`xhr object ${xhr}`);
    xhr.open('GET', 'http://localhost:81/loadTips', true);
    xhr.send();
    xhr.addEventListener('onreadystatechange', processRequest, false);
    xhr.onreadystatechange = processRequest;
    function processRequest(e){
        if(xhr.status == 200 && xhr.readyState == 4){
            console.log(`xhr.responseText: ${xhr.responseText}`)
        }
    }
}
//xhrLoad();

// CORS extracted from https://www.html5rocks.com/en/tutorials/cors/
// Create the XHR object.
function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        // XHR for Chrome/Firefox/Opera/Safari.
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
        // XDomainRequest for IE.
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        // CORS not supported.
        xhr = null;
    }
    return xhr;
}

// Helper method to parse the title tag from the response.
function getTitle(text) {
    return text.match('<title>(.*)?</title>')[1];
}

// Make the actual CORS request.
function makeCorsRequest() {
    // This is a sample server that supports CORS.
    var url = 'http://html5rocks-cors.s3-website-us-east-1.amazonaws.com/index.html';

    var xhr = createCORSRequest('GET', url);
    if (!xhr) {
        alert('CORS not supported');
        return;
    }

    // Response handlers.
    xhr.onload = function() {
        var text = xhr.responseText;
        var title = getTitle(text);
        alert('Response from CORS request to ' + url + ': ' + title);
    };

    xhr.onerror = function() {
        alert('Woops, there was an error making the request.');
    };

    xhr.send();
}

//makeCorsRequest();