class Bearing {

  constructor(elementButtonId, label) {
    this.elementButtonId = elementButtonId;
    this.label = label;
  }

  loadElements() {
    this.elementButton = document.getElementById(this.elementButtonId);
  }

  update(value) {
    this.elementButton.dataset.label = this.label + ": " + Math.round(radiansToDegrees(value));
  }
}
