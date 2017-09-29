/**
 * Created by RemyValery on 10/8/2016.
 */
var express = require('express'),
    app = express(),
    config = require('../utils/config'),
    bodyParser = require('body-parser'),
    childProcess = require('child_process'),
    port = config.Server.port,
    net = require('net'),

    useEP = config.Server.useTerminal, // '/scoretrade/'
    index = useEP + config.index.path, // '/scoretrade/index.html'
    myPage = useEP + config.myPage.path, // '/scoretrade/htmlTemplates/myPage.html'
    dashBoard = useEP + config.dashBoard.path, // '/scoretrade/htmlTemplates/big3Buttons.html'
    indexEP = config.Server.index, // '/index'
    myPageEP = config.Server.myPage,
    dashBoardEP = config.Server.dashBoard,
    indexUrl = config.Server.protocol
                + config.Server.host
                + config.Server.port
                + config.Server.useTerminal
                + config.index.path,            // 'http://localhost:811/scoretrade/index.html'

    urlencodedParser = bodyParser.urlencoded({extended: false}),
    UserTable = require('./dataBaseQuery'),
    fs = require('fs'),
    path = require('path'),
    staticPath = config.Server.staticPath, // '../'
    ip = config.Server.ip;

// Allow access to all clients. Too much research went into finding this.
//without this, This server will not allow access to the browser on same host.
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*"); //here
    return next();
});

// '/scoretrade/'
app.use(useEP, express.static(staticPath)); //'../'

// Login endpoint
app.post('/login', urlencodedParser, function (req, res) {
    var email = req.body.email, password = req.body.password;
    UserTable.login(email, password)
        .then(function (validCredentials) {
            if (validCredentials) {
                // res.redirect("http://localhost:63342/untitled/WebSiteApplications/scoretrades_com/htmlTemplates/big3Buttons.html")
                // '/scoretrade/htmlTemplates/big3Buttons.html'
                res.redirect( dashBoard )
            } else {
                res.send("<h1>Invalid Password</h1>").status(404);
            };
        }).catch(function (err) {
        console.log(err);
    })
});

// Sign up endpoint
app.post('/signUp', urlencodedParser, function (req, res) {
    var fname = req.body.fname,
        lname = req.body.lname,
        email = req.body.email,
        pswd = req.body.psw,
        img = req.body.img;
    UserTable.signUp(fname, lname, email, pswd, img)
        .then(function ( signedUp ) {
            if (signedUp) {
                console.log("name saved");
                res.redirect( indexUrl );
            }
        }).catch(function (err) {
        console.log(err);

    });
    if(img)
    UserTable.blobInsert('loginImageDescription', 'CaptionNeedsData', img , 1 )
        .then(function ( imageSaved ){
            if(imageSaved ) console.log("Image is saved")
        })

});

//"/index"
app.get(indexEP, urlencodedParser, function (req, res) {
    // res.redirect(config.index.url)
    res.redirect(index)
});

//"/myPage"
app.get(myPageEP, urlencodedParser, function (req, res) {
    res.redirect( myPage )
});

//"/dashBoard"
app.get(dashBoardEP, urlencodedParser, function (req, res) {
    res.redirect( dashBoard )//"/scoretrade/htmlTemplates/big3Buttons.html"
});


//===

// This is n attempt to forward the app port to port 80, the http port.
// The reasoning is that since http is accessed only via port 80, our index.html page on
// 80 will not have access to servers on other ports. So we want to set a proxy server
// that pipes port 80 to our app port.
// ..Needs work..

// parse "80" and "localhost:80" or even "42mEANINg-life.com:80"
var addrRegex = /^(([a-zA-Z\-\.0-9]+):)?(\d+)$/;

var addr = {
    to: addrRegex.exec(`${ip}:${port}`),
    from: addrRegex.exec(config.Server.forwardToIpPort)
};
//console.log('addr.from', addr.from);//[ '0.0.0.0:811', '0.0.0.0:', '0.0.0.0', '811', index: 0, input: '0.0.0.0:811' ]
//console.log('addr.to', addr.to);//[ '192.169.181.27:80', '192.169.181.27:', '192.169.181.27', '80', index: 0, input: '192.169.181.27:80' ]

var proxyServer = net.createServer(function(from) {
    var to = net.createConnection({
        host: addr.to[2],
        port: addr.to[3]
    });
    from.pipe(to);
    to.pipe(from);
});
proxyServer.on('error', (err) =>{
    //throw err;
});
proxyServer.listen(addr.from[3], addr.from[2]);

// == Our app port ==
var server = app.listen(port, ip, function (err) {
    err ? console.log('something wrong happened', err)
        : console.log(`formMediator.js: Example app listening on http://${ip}:${port}`)
})

var UseLessSpecific = "http://localhost:811/scoretrade/index.html";
childProcess.exec(`start chrome ${indexUrl}`, function(err, stdout, stderr){
    if(err){
        console.error(err);
        return;
    }
    console.log(stdout);
    //process.exit(0);
});
