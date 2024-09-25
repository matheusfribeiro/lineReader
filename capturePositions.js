const robot = require('robotjs');
const fs = require('fs');
const mouseEvents = require('global-mouse-events');

const positions = [
  'red bet position',
  'blue bet position',
  'tie bet position',
  'chip 5 position',
  'chip 10 position',
  'chip 25 position',
  'chip 125 position',
  'chip 500 position',
  'chip 2500 position',
  'green line position',
  'anti idle position',
];

const capturedPositions = {};
let currentStep = 0;

function askForPosition() {
  if (currentStep < positions.length) {
    console.log(`Click on the ${positions[currentStep]} on your screen.`);
  } else {
    fs.writeFileSync('positions.json', JSON.stringify(capturedPositions, null, 2));
    console.log('All positions captured and saved to positions.json');
    mouseEvents.removeAllListeners('mouseup');
    process.exit();
  }
}

mouseEvents.on('mouseup', event => {
  if (currentStep < positions.length) {
    const mousePos = robot.getMousePos();
    capturedPositions[positions[currentStep]] = mousePos;
    currentStep++;
    askForPosition();
  }
});

// Start capturing positions
askForPosition();
