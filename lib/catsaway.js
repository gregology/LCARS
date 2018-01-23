const HIGH_WIND = 8; //knots
const SHALLOW_WATER = 7; //feet
const AGGREGATION_PERIOD = 60 * 1000; //milliseconds
const WARNING_TIMEOUT = 60 * 1000; //milliseconds
const RECENCY_THRESHOLD = 60 * 1000; //milliseconds (made this high because the core's clock is slow after syncing with gps)
const SIGNALK_SERVER = 'core.lan:3000';

var ws = new ReconnectingWebSocket("ws://" + SIGNALK_SERVER + "/signalk/v1/stream?subscribe=all");

var avgWindSpeedDiv = document.getElementById('button_32');
var maxWindSpeedDiv = document.getElementById('button_35');
var windDirectionApparentDiv = document.getElementById('winddirectionapparent');
var magneticHeadingDiv = document.getElementById('magneticheading');
var courseOverGroundDiv = document.getElementById('courseoverground');
var speedThroughWaterDiv = document.getElementById('speedthroughwater');
var speedOverGroundDiv = document.getElementById('speedoverground');
var latitudeDiv = document.getElementById('latitude');
var longitudeDiv = document.getElementById('longitude');

let windSpeed = new WindSpeed('currentwindspeed');

ws.onopen = function() {
  var subscriptionObject = {
    "context": "vessels.self",
    "subscribe": [{
      "path": "*"
    }]
  };
  var subscriptionMessage = JSON.stringify(subscriptionObject);
  console.log("Sending subscription:" + subscriptionMessage)
  ws.send(subscriptionMessage);
}

ws.onclose = function() {
  console.log("ws close");
}

// ws.onmessage = function(event) {
//   data = JSON.parse(event.data);
//   if ('updates' in data) {
//     var updates = data['updates'][0];
//
//     updates["values"].forEach(function(value) {
//       if (value["path"] == "environment.wind.speedApparent") {
//         if (value["value"] != 0) {
//           windSpeed.addReading(metersPerSecondToKnots(value["value"]), Date.parse(updates["timestamp"]))
//           windSpeed.elementText.innerHTML = displayValue(Math.round(metersPerSecondToKnots(value["value"])));
//         }
//       // } else if (value["path"] == "environment.wind.angleApparent") {
//       //   if (value["value"] != 0) {
//       //     windDirectionApparentDiv.innerHTML = displayValue(radiansToDegrees(value["value"]));
//       //   }
//       // } else if (value["path"] == "navigation.headingMagnetic") {
//       //   magneticHeadingDiv.innerHTML = displayValue(radiansToDegrees(value["value"]));
//       // } else if (value["path"] == "navigation.speedThroughWater") {
//       //   speedThroughWaterDiv.innerHTML = displayValue(metersPerSecondToKnots(value["value"]));
//       // } else if (value["path"] == "navigation.speedOverGround") {
//       //   speedOverGroundDiv.innerHTML = displayValue(metersPerSecondToKnots(value["value"]));
//       // } else if (value["path"] == "navigation.position" && updates["source"]["label"] == "core") {
//       //   latitudeDiv.innerHTML = displayValue(+(value["value"]["latitude"].toFixed(6)));
//       //   longitudeDiv.innerHTML = displayValue(+(value["value"]["longitude"].toFixed(6)));
//       // } else if (value["path"] == "navigation.courseOverGroundTrue") {
//       //   courseOverGroundDiv.innerHTML = displayValue(radiansToDegrees(value["value"]));
//       }
//     });
//   }
// }

function aggregates() {
  window.setInterval(function () {
    windSpeed.removeOldReadings();
    if (windSpeed.hasReadings()) {
      maxWindSpeedDiv.innerHTML = displayValue(Math.round(windSpeed.max().reading));
      avgWindSpeedDiv.innerHTML = displayValue(Math.round(windSpeed.averageReading()));
    } else {
      maxWindSpeedDiv.innerHTML = "--";
      avgWindSpeedDiv.innerHTML = "--";
    }
  }, 3000);
}

// aggregates();

function windRecencyCheck() {
  window.setInterval(function () {
    if (!windSpeed.hasReadings() || !windSpeed.hasRecentReadings()) {
      console.log("no wind measurements received for " + windSpeed.millisecondsSinceLastReading() + " milliseconds");
      windSpeed.setError();
    }
  }, 2000);
}

// windRecencyCheck();

function highWindsCheck() {
  window.setInterval(function () {
    if (windSpeed.hasReadings() && windSpeed.highWinds()) {
      console.log("high winds of " + windSpeed.max().reading + " knots");
      windSpeed.setCritical();
    }
  }, 2000);
}

// highWindsCheck();


windSpeed.elementButton.style.cursor = 'pointer';
windSpeed.elementButton.onclick = function() {
  windSpeed.acknowledgeAlam()
};
