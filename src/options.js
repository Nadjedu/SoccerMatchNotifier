const BASE_URL = "https://www.thesportsdb.com/api/v1/json/1/lookup_all_teams.php?id=";
const leagueIDs = {England: 4328, Germany: 4331, Italy: 4332, France: 4334, Spain: 4335, USA: 4346};

function saveClub(){
    var club = document.getElementById("clubs");
    if(club.value === "default"){
        alert("Please select your favorite club");
    }
    else{
        var club_name = club.innerHTML;
        chrome.storage.sync.set({favoriteClub: club_name}, function(){
            var status = document.getElementById("save");
            status.textContent = "Options saved";
            setTimeout(function(){
                status.textContent = "save";
            }, 900);
        });
    }

}

function getAndAppendLeagueClubs(){
    var countrySelection = document.getElementById("countries");
    var league_Id = getLeagueID(countrySelection);
    var league_url = BASE_URL + league_Id;
    var message = {
        url: league_url,
        action: "getTeams"
    };
    chrome.runtime.sendMessage(message, function(response){
        if(response){
            var teams = [];
            for(var key in response.teams){
                teams.push(response.teams[key].strTeam);
            }
            appendClubs(teams);
        }
        else{
            console.log("Error from response", response);
        }
    });
}

function appendClubs(teams){
    var select = document.getElementById("clubs");
    resetOptions(select);
    for(var i = 0; i < teams.length; i++){
        var option = document.createElement("option");
        option.value = i;
        option.text = teams[i];
        select.appendChild(option);
    }
}

function resetOptions(select){
    if(select.length < 2){
        return;
    }
    else{
       for(var i = select.length - 1; i > 0; i--){
            select.removeChild(select.options[i]);
        } 
    }   
}

function getLeagueID(countrySelection){
    var country = countrySelection.value;
    for(var key in leagueIDs){
        if (country === key){
            return leagueIDs[key];
        }
    }
    return null;
}


document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("countries").addEventListener("change", getAndAppendLeagueClubs);
  document.getElementById("save").addEventListener("click", saveClub);
});
