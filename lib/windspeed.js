class WindSpeed {

  constructor() {
    this.readings = [];
    this.acknowledgments = {'highWinds': 0, 'noData': 0};
    this.lastReadingAt = 0;
    this.highWindsAlarm = false;
    this.missingDataAlarm = false;
  }

  loadElements() {
    var currentWindSpeedDiv = document.getElementById('currentwindspeed');

    this.elementText = currentWindSpeedDiv.children[2];
    this.elementButton = currentWindSpeedDiv.children[3];
    this.elementAvg = document.getElementById('averagewindspeed').children[1];
    this.elementMax = document.getElementById('maximumwindspeed').children[1];
  }

  setNormal() {
    this.elementButton.setAttribute("class", "button right bg-blue-1");
    this.elementButton.dataset.label = "Current Speed in Knots";
  }

  warnHighWinds() {
    console.log("Wind Speed alarm for High Winds!");
    this.elementButton.setAttribute("class", "button right red-dark-light");
    this.elementButton.dataset.label = "Warning - High Winds!";
    new Audio('lib/audio/safety_limits.wav').play();
    this.highWindsalarm = true;
  }

  warnNoData() {
    console.log("Wind Speed alarm for No Data!");
    this.elementText.innerHTML = "--";
    this.elementButton.setAttribute("class", "button right white-flash");
    this.elementButton.dataset.label = "Error - no recent readings!";
    new Audio('lib/audio/insufficient_data.wav').play();
    this.missingDataAlarm = true;
  }

  recentlyAcknowledgedHighWinds() {
    return ((new Date) - this.acknowledgments.highWinds) < WARNING_TIMEOUT;
  }

  recentlyAcknowledgedNoData() {
    return ((new Date) - this.acknowledgments.noData) < WARNING_TIMEOUT;
  }

  hasReadings() {
    return this.readings.length > 0;
  }

  highWinds() {
    return this.max().reading > HIGH_WIND;
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
    this.readings.push(
      {
        reading: reading,
        timestamp: timestamp
      }
    )
  }

  max() {
    return this.readings.sort(function(a, b) {
      return b.reading - a.reading
    })[0];
 }

  latest() {
    return this.readings.sort(function(a, b) {
      return b.timestamp - a.timestamp
    })[0];
  }

  averageReading() {
    var sumReadings = 0
    this.readings.forEach(function(reading) {
      sumReadings += reading.reading
    })
    return (sumReadings / this.readings.length)
  }

  checkAlarms() {
    var self = this;
    window.setInterval(function () {
      if (self.hasReadings() && self.highWinds() && !self.recentlyAcknowledgedHighWinds() && !self.highWindsAlarm) {
        console.log("high winds of " + self.max().reading + " knots");
        self.highWindsAlarm = true;
        self.warnHighWinds();
      } else if (self.hasReadings() && !self.hasRecentReadings() && !self.recentlyAcknowledgedNoData() && !self.missingDataAlarm){
        console.log("no wind measurements received for " + self.millisecondsSinceLastReading() + " milliseconds");
        self.missingDataAlarm = true;
        self.warnNoData();
      } else if (!self.highWinds() && self.highWindsAlarm) {
        console.log("winds no longer high with recent max of " + self.max().reading + " knots");
        self.highWindsAlarm = false;
        self.setNormal();
      } else if (self.hasRecentReadings() && self.missingDataAlarm) {
        console.log("most recent wind measurements received " + self.millisecondsSinceLastReading() + " milliseconds ago");
        self.missingDataAlarm = false;
        self.setNormal();
        new Audio('lib/audio/re-establishing-link.wav').play();
      }
    }, 1000);
  }

  acknowledgeAlarm() {
    if (this.highWindsAlarm) {
      console.log("High winds warning acknowledged");
      this.acknowledgments.highWinds = new Date;
      new Audio('lib/audio/input_ok_1_clean.mp3').play();
      this.setNormal();
      this.highWindsAlarm = false;
    } else if (this.missingDataAlarm) {
      console.log("No Data warning acknowledged");
      this.acknowledgments.noData = new Date;
      new Audio('lib/audio/input_ok_2_clean.mp3').play();
      this.setNormal();
      this.missingDataAlarm = false;
    }
  }

  updateAggregates() {
    var self = this;
    window.setInterval(function () {
      if (self.hasReadings()) {
        self.elementMax.innerHTML = self.max().reading.toFixed(0);
        self.elementAvg.innerHTML = self.averageReading().toFixed(0);
      } else {
        self.elementMax.innerHTML = "--";
        self.elementAvg.innerHTML = "--";
      }
    }, 2000);
  }

  removeOldReadings() {
    var self = this;
    window.setInterval(function () {
      if (self.hasReadings()) {
        self.readings = self.readings.filter(function(reading) {
          return ((new Date) - reading.timestamp) < AGGREGATION_PERIOD;
        })
      }
    }, 5000);
  }
}
