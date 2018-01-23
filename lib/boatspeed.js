class BoatSpeed {

  constructor(elementId) {
    this.elementId = elementId;
  }

  loadElements() {
    this.elementBar = document.getElementById(this.elementId).children[0];
  }

  update(value) {
    var knots = metersPerSecondToKnots(value);
    this.elementBar.style = horizontalBarStyle(knots * 10);
    this.elementBar.dataset.label = knots.toFixed(1);
  }
}
