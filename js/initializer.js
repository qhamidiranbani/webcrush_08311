function populate()
{
    var dayField       = $('[data-field="birthDate.day"]');
    var monthField     = $('[data-field="birthDate.month"]');
    var yearField      = $('[data-field="birthDate.year"]');
    var answerOrdinal = 2;
    var now = new Date();
    for (var i = 1; i <= 31; i++) {
        dayField.append('<option id="Question7Answer' + answerOrdinal  +'" data-questionid="7" value="' + i + '">' + i + '</option>');
        answerOrdinal++;
    }
    answerOrdinal = 2;

    for (var i = 1; i <= 12; i++) {
        monthField.append('<option id="Question8Answer' + answerOrdinal  +'" data-questionid="8" value="' + i + '">' + i + '</option>');
        answerOrdinal++;
    }

    answerOrdinal = 2;

    for (var i = now.getFullYear() - 18; i >= now.getFullYear() - 99; i--) {
        yearField.append('<option id="Question9Answer' + answerOrdinal  +'" data-questionid="9" value="' + i + '">' + i + '</option>');
        answerOrdinal++;
    }
}

$('[data-field="birthDate.day"],[data-field="birthDate.month"],[data-field="birthDate.year"]').on('change',function(){
  updateInputOptionsFromUserChoices()
});

function updateInputOptionsFromUserChoices() {
  var dayField       = $('[data-field="birthDate.day"]');
  var monthField     = $('[data-field="birthDate.month"]');
  var yearField      = $('[data-field="birthDate.year"]');

  var yearValue     = parseInt(yearField.val()),
    monthValue    = parseInt(monthField.val()),
    dayValue      = parseInt(dayField.val()),
    maxDay        = null,
    maxMonth      = 12;
  if (yearValue !== undefined) {
    if (yearValue === new Date().getFullYear() - 18) {
      maxMonth = new Date().getMonth() + 1;

      if (monthValue === maxMonth) {
        maxDay   = new Date().getDate();
      }
    }
    for (var i = 1; i <= 12; i++) {
      if (i > maxMonth) {
        $('option[value="' + i + '"]', monthField).prop('disabled', true);
      } else {
        $('option[value="' + i + '"]', monthField).prop('disabled', false);
      }
    }
  }

  if (monthValue > maxMonth) {
    monthField.val('');
  }

  if (maxDay !== null || (yearValue !== undefined && monthValue !== undefined)) {
    if (maxDay === null) {
      maxDay = new Date(yearValue, monthValue, 0).getDate();
    }

    if (dayValue !== undefined && maxDay < dayValue) {
      dayField.val('');
    }

    for (var i = 1; i <= 31; i++) {
      if (i > maxDay) {
        $('option[value="' + i + '"]', dayField).prop('disabled', true);
      } else {
        $('option[value="' + i + '"]', dayField).prop('disabled', false);
      }
    }
  }
}

var componentForm = {
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'long_name',
};

function initAutocomplete() {

    autocomplete = new google.maps.places.Autocomplete(document.getElementById('Question18Answer1'), {types: ['(cities)']});
    autocomplete.setComponentRestrictions({'country': [window.APP_COUNTRY_CODE || 'us']});

    autocomplete.setFields(['address_component']);

    autocomplete.addListener('place_changed', fillInAddress);

    setTimeout(function(){
        $("#Question18Answer1").attr('autocomplete', 'chrome-off');
    }, 1000);
}

function fillInAddress() {
    $('body').removeClass('keepauto_complete');
    var place = autocomplete.getPlace();
    isPlaceChanged = true;

    var areaLevelKey = window.areaLevelKey || 'administrative_area_level_1';

    for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        if (componentForm[addressType]) {
            var val = place.address_components[i][componentForm[addressType]];
            document.getElementById(addressType).value = val;
        }

      for (var j = 0; j < place.address_components[i]['types'].length; j++) {
        if (place.address_components[i]['types'][j] == areaLevelKey) {
          document.getElementById("state_code").value = place.address_components[i]['short_name'];
          document.getElementById("region").value = place.address_components[i]['long_name'];
        } else if (place.address_components[i]['types'][j] == 'locality') {
          document.getElementById("locality").value = place.address_components[i]['long_name'];
        }
      }
    }
    if (window.fillOffset) {
      window.fillOffset();
    } else {
      var offset_time = {AB:420, BC:480, MB:360, NB:240, NF:240, NT:420, NS:240, NU:360, ON:300, PE:240, QC:360, SK:360, YT:540};

      var state = $("input[name='state_code']").val();
      $("input[name='offset_time']").val(offset_time[state]);
    }
}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
    $('body').removeClass('keepauto_complete');
}
/*code to get the auot address*/
var placeSearch, autocomplete;

$(document).on('keydown', '#Question18Answer1', function () {
    isPlaceChanged = false;
});

populate();
