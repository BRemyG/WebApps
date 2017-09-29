/**
 * Created by RemyValery on 10/1/2016.
 */
/**
 * Created by n88047 on 8/18/2016.
 */
function returnToSignIn(n){
    window.setTimeout(jumptoindex, n*1000);
}

function jumptoindex(){
//    window.open("www.scoretrades.com/index.html");
    var body = document.getElementById('body');
    body.innerHTML = "<h2>  Its been 30secs. Peephole Timed Out...! <br>  Sign up and get full access...<br><br> What are people saying about your favorites? <br> <br> What you want them to know? </h2>"
    window.open("index.html");

}
