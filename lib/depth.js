class Depth {

  constructor() {
    this.readings = {};
    this.state = 'normal';
    this.acknowledgments = {'shallowWater': 0, 'noData': 0};
    this.lastReadingAt = 0;
    this.shallowWaterAlarm = false;
    this.missingDataAlarm = false;
  }

  loadElements() {
    var currentDepth = document.getElementById('currentdepth');
    var recentDepth = document.getElementById('recentdepth');

    this.elementText = currentDepth.children[2];
    this.elementButton = currentDepth.children[3];
    this.graphElements = Array.from(recentDepth.children).reverse().map( function(element) {
      return element.children[0].children[0];
    })
  }

  drawGraph() {
    var latestKey = this.latestKey()
    var self = this;
    this.graphElements.forEach(function(element, idx) {
      var reading = self.readings[latestKey - idx];
      if (typeof reading != 'undefined') {
        element.style = verticalBarStyle(100 - (reading * 5));
        element.dataset.label = reading.toFixed(2);
        element.setAttribute("class", self.depthColour(reading));
      } else {
        element.style = verticalBarStyle(50);
        element.dataset.label = 'Unknown';
        element.setAttribute("class", "bar bg-grey-3");
      }
    })
  }

  depthColour(depth) {
    if (depth > 20) {
      return 'bar bg-blue-4';
    } else if (depth > 15) {
      return 'bar bg-blue-3';
    } else if (depth > 10) {
      return 'bar bg-blue-2';
    } else if (depth > 5) {
      return 'bar bg-blue-1';
    } else {
      return 'bar bg-red-1';
    }
  }

  setNormal() {
    this.elementButton.setAttribute("class", "button right bg-blue-2");
    this.elementButton.dataset.label = "Current Depth in Feet";
  }

  warnShallowWater() {
    console.log("Water Depth alarm for Shallow Water!");
    this.elementButton.setAttribute("class", "button right red-dark-light");
    this.elementButton.dataset.label = "Warning - Shallow Water!";
    new Audio('lib/audio/critical.mp3').play();
    this.shallowWaterAlarm = true;
  }

  warnNoData() {
    console.log("Water Depth alarm for No Data!");
    this.elementText.innerHTML = "---";
    this.elementButton.setAttribute("class", "button right white-flash");
    this.elementButton.dataset.label = "Error - no recent readings!";
    new Audio('lib/audio/link-data-disconnected.wav').play();
    this.missingDataAlarm = true;
  }

  recentlyAcknowledgedShallowWater() {
    return ((new Date) - this.acknowledgments.shallowWater) < WARNING_TIMEOUT;
  }

  recentlyAcknowledgedNoData() {
    return ((new Date) - this.acknowledgments.noData) < WARNING_TIMEOUT;
  }

  hasReadings() {
    return this.readings.length > 0;
  }

  shallowDepth() {
    return this.latestReading() < SHALLOW_WATER;
  }

  millisecondsSinceLastReading() {
    return (new Date - this.lastReadingAt);
  }

  hasRecentReadings() {
    return this.millisecondsSinceLastReading() < RECENCY_THRESHOLD;
  }

  addReading(reading, timestamp) {
    // throw in some type errors when reading is not number or timestamp is not timestamp
    this.lastReadingAt = timestamp;
    var timestampKey = Math.round(timestamp / 1000);
    this.readings[timestampKey] = reading;
  }

  latestKey() {
    return Math.max.apply(null, Object.keys(this.readings));
  }

  latestReading() {
    return this.readings[this.latestKey()];
  }

  checkAlarms() {
    var self = this;
    window.setInterval(function () {
      if (self.shallowDepth() && !self.recentlyAcknowledgedShallowWater() && !self.shallowWaterAlarm) {
        console.log("shallow water of " + self.latestReading() + " feet");
        self.shallowWaterAlarm = true;
        self.warnShallowWater();
      } else if (!self.hasRecentReadings() && !self.recentlyAcknowledgedNoData() && !self.missingDataAlarm){
        console.log("no depth measurements received for " + self.millisecondsSinceLastReading() + " milliseconds");
        self.missingDataAlarm = true;
        self.warnNoData();
      } else if (!self.shallowDepth() && self.shallowWaterAlarm) {
        console.log("depth no longer shallow with recent depth of " + self.latestReading() + " feet");
        self.highWindsAlarm = false;
        self.setNormal();
      } else if (self.hasRecentReadings() && self.missingDataAlarm) {
        console.log("most recent depth measurements received " + self.millisecondsSinceLastReading() + " milliseconds ago");
        self.missingDataAlarm = false;
        self.setNormal();
      }
    }, 1000);
  }

  acknowledgeAlarm() {
    if (this.shallowWaterAlarm) {
      console.log("Shallow Water warning acknowledged");
      this.acknowledgments.shallowWater = new Date;
      new Audio('lib/audio/input_ok_1_clean.mp3').play();
      this.setNormal();
      this.shallowWaterAlarm = false;
    } else if (this.missingDataAlarm) {
      console.log("No Data warning acknowledged");
      this.acknowledgments.noData = new Date;
      new Audio('lib/audio/input_ok_2_clean.mp3').play();
      this.setNormal();
      this.missingDataAlarm = false;
    }
  }

  removeOldReadings() {
    var self = this;
    window.setInterval(function () {
      Object.keys(self.readings).forEach(
        function(value) {
          if (parseInt(value) < (self.latestKey() - 8)) {
            delete self.readings[value]
          }
        }
      )
    }, 5000);
  }
}
