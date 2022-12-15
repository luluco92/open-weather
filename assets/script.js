const city = $('#searchcity');
const history = $('#recents');
var latlonURL;

function updatehistory() {
  history.html('');

  if (localStorage.getItem('recentcities')) {
  let loadarray = JSON.parse(localStorage.getItem('recentcities'));

  

  $.each(loadarray, function(x, y) { history.append('<button>' + y + '</button>'); });
  }
  else { return; }

}

function addtoStorage(string) {
      let cityarray = [];
      if (localStorage.getItem('recentcities')) {
         cityarray = cityarray.concat(JSON.parse(localStorage.getItem('recentcities')));
         if (cityarray.includes(string)) { cityarray.splice(cityarray.indexOf(string),1);}
      }
  cityarray.unshift(string);
  localStorage.setItem('recentcities', JSON.stringify(cityarray));
 
}

function showresult() {

$('.card-container').children().remove();

$.ajax({ url: 'https://api.openweathermap.org/geo/1.0/direct?q=' + JSON.parse(localStorage.getItem('recentcities'))[0] + '&limit=1&appid=1344f093f16f0a5c1c05bae5c0c2942f', method: 'GET',})
    .then(function(result1) {
       if (result1) {
       var todays = new Date();
       latlonURL = result1[0].lat + '&lon=' + result1[0].lon
       console.log(result1);
       $.ajax({ url: 'https://api.openweathermap.org/data/2.5/forecast?lat=' + latlonURL + '&cnt=40&units=imperial&appid=1344f093f16f0a5c1c05bae5c0c2942f', method: 'GET',})
          .then(function(result2) {
             var iconURL;
             console.log(result2);
             if (result2) {
                var todays = new Date();
                iconURL = 'https://openweathermap.org/img/wn/' + result2.list[0].weather[0].icon + '.png'
                // $('#resultname').text(result2.city.name + ' - ' + todays.getFullYear() + '-' + (todays.getMonth() + 1) + '-' + todays.getDate());
                $('#resultname').text(result2.city.name + ' - ' + result2.list[0].dt_txt.slice(0,10));
                $('#resultname').parent().children('img').attr('src', iconURL);
                $('#resultname').parent().children('ul').children().eq(0).text('Temp: ' + result2.list[0].main.temp + ' \u00B0F');
                $('#resultname').parent().children('ul').children().eq(1).text('Wind: ' + (result2.list[0].wind.speed * 2.2369).toFixed(2) + ' MPH');
                $('#resultname').parent().children('ul').children().eq(2).text('Humidity: ' + result2.list[0].main.humidity + ' %');

                //86400s per day   make 5 cards for the next 5 days
                $('#5dforecast').css('display', 'block');

                for (i=7; i<40; i+=8) {
                var flexcard = $('<div>');
                flexcard.append('<h4>' + result2.list[i].dt_txt.slice(0,10) + '</h4>');
                flexcard.append('<img height=40px width=40px>');
                flexcard.children('img').attr('src', 'https://openweathermap.org/img/wn/' + result2.list[i].weather[0].icon + '.png');
                flexcard.append('<ul></ul>');
                flexcard.children('ul').append('<li>Temp: ' + result2.list[i].main.temp + '\u00B0F</li>')
                flexcard.children('ul').append('<li>Wind: ' + (result2.list[i].wind.speed * 2.2369).toFixed(2) + 'MPH</li>')
                flexcard.children('ul').append('<li>Humidity: ' + result2.list[i].main.humidity + '%</li>')
                flexcard.children('ul').css('padding', '8px');
                flexcard.css('border', '4px solid teal');
                flexcard.css('background-color', 'lightgray');
                $('.card-container').append(flexcard);

                }
       }
    });
       }
       else {return;}
    });



}

// Action to be performed on click store in named function
function searchcity(event) {
  // Prevent default action
  event.preventDefault();

  if (!city.val().trim()) { return; }
  addtoStorage(city.val().trim());

  city.val('');
  updatehistory();
  showresult();
}


  
// Add listener to submit element
$('#submitcity').on('click', searchcity);

history.on('click', function(event) {
  var target = $(event.target);
  if (target.is("button")) {
    addtoStorage(target.text());
    updatehistory();
    showresult();
  }
});

updatehistory();
