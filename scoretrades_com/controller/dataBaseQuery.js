/**
 * Created by RemyValery on 10/8/2016.
 */
var mysql = require("mysql"),
    Promise = require("bluebird"),
    config = require('./../utils/config'),
    index = 'C:\\Users\\RemyValery\\WebstormProjects\\untitled\\WebSiteApplications\\scoretrades__com\\index.html',
    userSpace = 'C:\\Users\\RemyValery\\WebstormProjects\\untitled\\WebSiteApplications\\scoretrades__com\\htmlTemplates\\userSpace.html';

var con = mysql.createConnection(config.mysqlConnection);
var date = new Date(),
    dbdate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
    userfname,userlname;

//create a  unique reference string to be used for unique objects, like images.
function uniqueReferenceGenerator(){
    var date = Date.now();
    var mathradix = Math.round(Math.random()*10000000);
    return date.toString(16) + mathradix.toString(16);
}

module.exports = {
    signUp: function (fname, lname, email, pswd, img) {
        userfname = fname;
        userlname = lname;
        return new Promise( function(resolve, reject){
            var newAccount = {LastName: mysql.escape(lname), FirstName: mysql.escape(fname), email: mysql.escape(email), password: mysql.escape(pswd), DateOfCreation: dbdate};
            con.query('INSERT INTO scoretrades.login SET?', newAccount, function (err, res) {
                if (err) {
                    // reject(err);
                    throw err;
                };
//            console.log('login id: ', res.insertId);
                resolve (res.insertId );
            });

        })
    },
    login: function (email, password) {
        return new Promise( function (resolve, reject){
            var emailparam = mysql.escape(email), passwordparam = mysql.escape(password);
            var queryString = 'SELECT * FROM scoretrades.login WHERE email = ? AND password = ?' ,
                values = [emailparam, passwordparam];
            con.query( queryString, values ,function (err, res) {
                if (err) throw err;
                var validCredentials =  res.length>0?  true :  false;
                resolve (validCredentials);

            })
        });
    },
    blobInsert: function ( imageDescription, imageCaption, imageBlob, imageIsPublic){
        return new Promise( function(resolve, reject){
            var imageOwner  = `${userfname}_${userlname}`,
                imageRef = uniqueReferenceGenerator();
            var imageData = {
                imageRef: imageRef,
                imageOwner: mysql.escape(imageOwner),
                imageDateTimeOfCreation: dbdate,
                imageDescription: mysql.escape(imageDescription),
                imageCaption: mysql.escape(imageCaption),
                imageBLOB: imageBlob,
                imageIsPublic: mysql.escape(imageIsPublic) //0 for false, 1 for true
            };
            con.query('INSERT INTO scoretrades.imagedata SET?', imageData, function (err, res) {
                if (err) throw err ;
//            console.log('login id: ', res.insertId);
                resolve (res.insertId );
            });
        })
    },
    blobRetrieve: function(){
        return new Promise(function(resolve, reject){
            var imageRequestor  = `${userfname}_${userlname}`;
            var imageData = {
                imageRequestor: mysql.escape(imageRequestor),
                imageRef: imageRef
            }
        })

    }
};