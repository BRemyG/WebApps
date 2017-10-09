/**
 * Created by RemyValery on 10/4/2017.
 */
const http = require('http');
const https = require('https');
const querystring = require('querystring');
const cheerio = require('cheerio');
const conf = require('./config.json').webCrawler;

let urlList = conf.crawlingList;
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
                    callback(dataChunk);
                    console.log(`NO more data for ${url}`);
                    resolve({url, indx});
                });
            })
        } else
            {
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
                            callback(dataChunk);
                            console.log(`NO more data for ${url}`);
                            resolve({url, indx});
                        });
                    }
                )
            };
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
            urlList = dataCollection.hrefs;
            dataCollection.hrefs = [];
            httpListCallWithPromise(urlList, 0, callback);
            console.log('\n ============ THANK YOU! ============ \n\n\t\t\t\t__ __\n\t\t\t\t @ @\n\t\t\t\t  O');
        }

    }).catch(e =>{
        console.error (e);
        console.log(` === url : ${url} ===`);
        console.log('caught an Error. what to do with it?')
    })
}


function collectDOMData(data) {
    var $ = cheerio.load(data);

    // grab all href links from this data
    $('a').each((indx, a) => {

        if (qualifiedURL(a.attribs.href)) {
            console.log(`${indx}`, a.attribs.href);
            dataCollection.hrefs.push(a.attribs.href)
        }

    })
    return dataCollection;
}

function qualifiedURL(url) {
    var http_is_first_subString = url && (url.indexOf('http') === 0);
    var One_protocol_within_url_string = url && (url.indexOf('http') === url.lastIndexOf('http'));
    var url_exists_and_has_http = url && (((url).toString()).indexOf('http') > -1);
    return url_exists_and_has_http && One_protocol_within_url_string && http_is_first_subString;
}


// == EXECUTE ==
httpListCallWithPromise(urlList, 0, collectDOMData);