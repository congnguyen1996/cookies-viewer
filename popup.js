let currentCookie="";
function loadCurrentCookie() {
    chrome.tabs.getSelected(null, function (tab) {
        let currentUrl=tab.url;
        $('#CurrentCookieUrl').html(extractHostname(currentUrl));
        chrome.cookies.getAll({ "url": currentUrl }, function (cookie) {
            console.log(currentUrl);
            console.log(cookie);
            let result = "";
            for (let i = 0; i < cookie.length; i++) {
                result += cookie[i].name + "=" + cookie[i].value + "; ";
            }
            result += "useragent=" +btoa(navigator.userAgent).replace('=','%3D').replace('=','%3D').replace('=','%3D')+ "; ";
            document.getElementById('cookieresult').value = result;
            currentCookie = result;
            chrome.tabs.getSelected(null, function(tab) {
                chrome.tabs.executeScript(tab.id,{
                    code: 'localStorage["z_uuid"]',}, function (results){
                    if(results){
                        currentCookie+= "z_uuid="+results+"; ";
                        document.getElementById('cookieresult').value = currentCookie;
                    }
                });
            });
        });
    });
}
function extractHostname(url) {
    let hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("://") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
}

loadCurrentCookie();
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
        chrome.tabs.getSelected(null, function (tab2) { // null defaults to current window
            if (tab2.id === tabId) {
                loadCurrentCookie();
            }
        });
    }
})

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('cookieresult').onclick = function(){
        document.getElementById('cookieresult').select();
    };
});