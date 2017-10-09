/**
 * Created by RemyValery on 10/4/2017.
 */
const http = require('http');
const https = require('https');
const querystring = require('querystring');
const cheerio = require('cheerio');
const conf = require('./config.json').ESPN;
const fs = require('fs');

let urlList = conf.urlList;
let dataCollection = {};
dataCollection.hrefs = [];

function httpListCallWithPromise(urlList, indx, callback) {
    let url = urlList[indx];

    let prom = new Promise(function (resolve, reject) {
            var req;
            if (url.indexOf('http:') > -1) {
                req = http.request(url, res => {
                    let dataChunk = '';
                    console.log(`===== ${url} =====\n\t STATUS: ${res.statusCode}`);
                    res.setEncoding('utf8');
                    res.on('data', chunk => {
                        dataChunk += chunk;
                        //console.log('dataChunk : ', dataChunk)
                    });
                    //console.log(dataChunk);
                    res.on('end', () => {
                        // callback.call(this, dataChunk);
                        callback(dataChunk, url);
                        console.log(`NO more data for ${url}`);
                        resolve({url, indx});
                    });
                })
            } else {
                req = https.request(url, res => {
                        let dataChunk = '';
                        console.log(`===== ${url} =====\n\t STATUS: ${res.statusCode}`);
                        res.setEncoding('utf8');
                        res.on('data', chunk => {
                            dataChunk += chunk;
                            //console.log('dataChunk : ', dataChunk)
                        });
                        console.log(dataChunk);
                        res.on('end', () => {
                            // callback.call(this, dataChunk);
                            callback(dataChunk, url);
                            console.log(`NO more data for ${url}`);
                            resolve({url, indx});
                        });
                    }
                )
            }
            ;
            req.on('error', e => {
                console.log(`problem with requests: ${e.message}`);
                reject(e);
            });
            req.end();
        }
    );
    prom.then(param => {
        param.indx++;
        if (urlList.length > param.indx) {
            httpListCallWithPromise(urlList, param.indx, callback);
        } else {
            console.log('\n ============ THANK YOU! ============ \n\n\t\t\t\t__ __\n\t\t\t\t @,@\n\t\t\t\t  U');
        }

    }).catch(e => {
        console.error(e);
        console.log(` === url : ${url} ===`);
        console.log('caught an Error. what to do with it?')
    })
}

function collectDOMData(data, url) {
    var cssLinks = '', httpHeader = '';
    var footer = `</div></body></html>`;
    var section = '';
    var $ = cheerio.load(data);


    // //all h1's in section element
    // $('section h1').each(function(i, e){
    //     //console.log(`${i}`,$(this).attr('class','contentItem__title contentItem__title--hero').text())
    //     console.log(`${i}`,$(this).html())
    // });

    // // selecting attributes
    // $('[srcset]').each(function(i, e){
    //     console.log(e.attribs)
    // });
// Attributes of all source elements. Attribute values have links to source.
//     $('source').each(function(i, e){
//          console.log(`${i}`,e.attribs)
//     });
    //grab all href links from this data
    $('a').each( function(indx, a) {

        if  (urlIsQuickLink (a.attribs.href)) {
        a.attribs.href = url + a.attribs.href;
    }

    });

    //grab all href links from this data
    $('link').each(function(indx, a) {

        if (urlIsCssLink(a.attribs.href)) {
            cssLinks += `<link rel="stylesheet" href="${a.attribs.href}">\n`;
            // inLink.push($(this).html())
            }
    });

    //
    $('section').each(function (i, e) {
        //console.log(`${i}`, e.children.length);
        //console.log(`${i}`,$(this).children('div div').html())
        //console.log(`${i}`, $(this).html());
        section += `<div class="w3-card-4" style="width:70%"> ${$(this).html()} </div>\n`
    });
    
    httpHeader = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
    ${cssLinks}
    <title>Score trades</title>
</head>
<body>
<div class="w3-container">\n`;
    
    fs.writeFile(conf.scrapLocation, httpHeader + section + footer, (err)=> {
        if (err) throw err;
    console.log(httpHeader);
        console.log('The file has been saved')
    })

    // grab all href links from this data
    // $('a').each((indx, a) => {
    //
    //     if (qualifiedURL(a.attribs.href)) {
    //         console.log(`${indx}`, a.attribs.href);
    //         dataCollection.hrefs.push(a.attribs.href)
    //     }
    //
    // })

}

function qualifiedURL(url) {
    var http_is_first_subString = url && (url.indexOf('http') === 0);
    var One_protocol_within_url_string = url && (url.indexOf('http') === url.lastIndexOf('http'));
    var url_exists_and_has_http = url && (((url).toString()).indexOf('http') > -1);
    return url_exists_and_has_http && One_protocol_within_url_string && http_is_first_subString;
}
function urlIsQuickLink(url) {
    if (url)
        return (!qualifiedURL(url) && (url.indexOf('/') === 0))

}
function urlIsCssLink(url) {
    if(url)
        return(qualifiedURL(url) && (url.indexOf('css') > -1))
}


// == EXECUTE ==
module.exports = function scrapeFromOnePage(){
    
    setInterval( function(){
        httpListCallWithPromise(urlList, 0, collectDOMData)
    }, 45000)
}
//httpListCallWithPromise(urlList, 0, collectDOMData);
