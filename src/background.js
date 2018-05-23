chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        console.log('This is the first install');
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    switch(request.action){
        case "getTeams":
            fetch(request.url)
                .then(function(response){
                    response.json().then(function(data){
                        sendResponse(data);
                        return true;
                    });
                })
                .catch(function(error){
                    console.log("Fetch error :", error);
                    sendResponse();
                    return false;
                });
            return true;
        default:
            console.log("Request not recognized", request);
            break;
    }
});
