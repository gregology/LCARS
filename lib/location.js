class Location {

  constructor(elementButtonId) {
    this.elementButtonId = elementButtonId;
  }

  loadElements() {
    this.elementButton = document.getElementById(this.elementButtonId);
  }

  update(value) {
    this.elementButton.dataset.label = "Lat: " + value["latitude"].toFixed(6) + "\nLong: " + value["longitude"].toFixed(6);
  }
}
