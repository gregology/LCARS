
function displayValue(value) {
  return JSON.stringify(value, null, 2);
}

function radiansToDegrees(rad) {
  return +((rad * 180 / Math.PI).toFixed(2));
}

function metersPerSecondToKnots(mps) {
  return +((mps * 1.943844).toFixed(2));
}

function metersToFeet(meters) {
  return +((meters * 0.3048).toFixed(2));
}

function displayTwoNumbers(num) {
  if (num <= 9.95) {
    return num.toFixed(1);
  } else {
    return num.toFixed(0);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function verticalBarStyle(percent) {
  return "height: calc(" + String(percent) + "% - 10px)";
}

function horizontalBarStyle(percent) {
  return "width: calc(" + String(percent) + "% - 10px)";
}
