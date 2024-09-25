const robot = require('robotjs');
const { applyPattern1, applyPattern2 } = require('./patterns');
const { placeBet100, placeBet150, placeBet200, placeBet250, placeBet300 } = require('./betPlacer');
const { sendMessageToGroup, startScreenshotInterval, sendScreenshot } = require('./telegram')
const fs = require('fs');
const positions = JSON.parse(fs.readFileSync('positions.json', 'utf8'));

if (fs.existsSync('positions.json')) {
  sendScreenshot()
  sendMessageToGroup('Server is running!')
  startScreenshotInterval()
} else {
  console.log('positions.json does not exist. Please run npm positions first to capture the positions.');
  process.exit(1);
}

let greenCounter = 0
let redCounter = 0
let tieCounter = 0
let results = [];
let checkResult = false
let lastResult = ''
let skipNextResultForPattern1 = false;  // Flag to ignore the first result for Pattern 1
let skipNextResultForPattern2 = false;  // Flag to ignore the first result for Pattern 2
let opposite = true


robot.setMouseDelay(300);

// Delay utility function
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function saveResult(color) {
  const resultData = { result: color, timestamp: new Date().toISOString() };
  const filePath = 'results.json';

  let existingData = [];
  if (fs.existsSync(filePath)) {
    existingData = JSON.parse(fs.readFileSync(filePath));
  }

  existingData.push(resultData);
  fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
}

// Utility function to convert hex to RGB
function hexToRgb(hex) {
  const bigint = parseInt(hex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

// Color detection functions
function isGray({ r, g, b }) {
  return r >= 95 && r <= 100 && g >= 90 && g <= 100 && b >= 80 && b <= 90;
}

function isRed({ r, g, b }) {
  return r >= 110 && r <= 140 && g >= 10 && g <= 20 && b >= 10 && b <= 20;
}

function isBlue({ r, g, b }) {
  return r >= 15 && r <= 20 && g >= 55 && g <= 70 && b >= 150 && b <= 200;
}

function isTie({ r, g, b }) {
  return r >= 150 && r <= 180 && g >= 100 && g <= 120 && b >= 10 && b <= 30;
}

// Function to get pixel color at a specific location
function getPixelColor(position) {
  const colorHex = robot.getPixelColor(position.x, position.y);
  const r = parseInt(colorHex.substring(0, 2), 16);
  const g = parseInt(colorHex.substring(2, 4), 16);
  const b = parseInt(colorHex.substring(4, 6), 16);
  return { r, g, b };
}

// Function to check if green or yellow line is visible
function isGreenOrYellow(color) {
  const { r, g, b } = color;
  const isGreen = r >= 0 && r <= 50 && g >= 150 && g <= 255 && b >= 0 && b <= 50;
  const isYellow = r >= 190 && r <= 255 && g >= 160 && g <= 210 && b >= 0 && b <= 15;
  return isGreen || isYellow;
}

// Function to determine if the green or yellow line is visible
function isGreenLineVisible() {
  const hexColor = robot.getPixelColor(positions['green line position'].x, positions['green line position'].y);
  const rgbColor = hexToRgb(hexColor);
  return isGreenOrYellow(rgbColor);
}

// Function to wait for either green or yellow line to become visible
async function waitForGreenLine() {
  const timeout = 15000; // Set timeout limit (15 seconds)
  const interval = 500;  // Check every 500 milliseconds
  const maxChecks = timeout / interval;

  let checkCount = 0;

  while (!isGreenLineVisible()) {
    console.log('Checking for green or yellow line...');
    await delay(interval);
    checkCount++;

    if (checkCount >= maxChecks) {
      console.log('Green or yellow line not found within the timeout period.');
      return false;
    }
  }

  console.log('Green or yellow line found');
  return true;
}



// Handle the result and apply patterns
function handleResult(result, results) {
  console.log(`Result detected: ${result}`);
  
  // Apply patterns, but skip the next result if the flag is set
  let betColor = null;

  if (!skipNextResultForPattern1) {
    betColor = applyPattern1(results);
  } else {
    console.log("Skipping result for Pattern 1");
    skipNextResultForPattern1 = false;  // Reset the flag after skipping
  }

  if (!betColor && !skipNextResultForPattern2) {
    betColor = applyPattern2(results);
  } else if (skipNextResultForPattern2) {
    console.log("Skipping result for Pattern 2");
    skipNextResultForPattern2 = false;  // Reset the flag after skipping
  }

  return betColor;
}

// Main tracking function
async function trackLine() {
  
  let prediction = null;
  let isTracking = false;

  setInterval(() => {
    const lineColor = getPixelColor(positions['green line position']);

    if (isGray(lineColor)) {
      // Reset tracking when dice rolling (gray line)
      isTracking = true;
    }

    if (isTracking) {
      let result = null;

      if (isRed(lineColor)) {
        result = 'red';
      } else if (isBlue(lineColor)) {
        result = 'blue';
      } else if (isTie(lineColor)) {
        result = 'tie';
      }

      if (result) {
        results.push(result);  // Always store the result

        isTracking = false;
        prediction = handleResult(result, results);  // Apply patterns
        
        saveResult(result);
        monitorGreenLine(prediction, currentBetAmount);  // Place a bet if a pattern is matched

        // Handle result checking for counters
        const strategy = opposite ? "Opposite" : "Favor";
        if (checkResult && lastResult === result) {
          greenCounter++;
          sendMessageToGroup(`✅ GREEN! Count: Greens - ${greenCounter}, Reds - ${redCounter}, Ties - ${tieCounter} - Strategy - ${strategy}`);
        } else if (checkResult && result !== 'tie') {
          redCounter++;
          sendMessageToGroup(`❌ RED! Count: Greens - ${greenCounter}, Reds - ${redCounter}, Ties - ${tieCounter} - Strategy - ${strategy}`);
        } else if (checkResult && result === 'tie') {
          tieCounter++;
          sendMessageToGroup(`🟠 TIE! Count: Greens - ${greenCounter}, Reds - ${redCounter}, Ties - ${tieCounter} - Strategy - ${strategy}`);
        }

        checkResult = false;  // Reset check flag
      }
    }
  }, 1000); // Check every 1 second
}

async function monitorGreenLine(prediction, currentBetAmount) {
  if (!prediction) return;  // Early return if no prediction

  // Determine the color to bet on
  if (opposite) {
    prediction = (prediction === 'red') ? 'blue' : 'red';
  }

  console.log(`Placing bet on ${prediction}`);
  
  const greenLineFound = await waitForGreenLine();
  if (!greenLineFound) {
    console.log("Aborting bet due to green/yellow line not found.");
    return;  // Stop the process
  }

  await delay(500);  // Slight delay to ensure betting window opens

  // Map of bet amounts to corresponding functions
  const betPlacement = {
    100: placeBet100,
    150: placeBet150,
    200: placeBet200,
    250: placeBet250,
    300: placeBet300,
  };

  // Check if the current bet amount is valid
  if (betPlacement[currentBetAmount]) {
    const betColorPos = positions[`${prediction} bet position`];
    betPlacement[currentBetAmount](betColorPos);  // Place the bet
  } else {
    console.log(`Invalid bet amount: ${currentBetAmount}`);
    return;  // Early return if bet amount is invalid
  }

  lastResult = prediction;
  checkResult = true;

  // Set the flag to skip the next result for the pattern that triggered the bet
  const pattern1Result = applyPattern1(results);
  const pattern2Result = applyPattern2(results);
  
  if (prediction === pattern1Result) {
    skipNextResultForPattern1 = true;  // Skip the next result for Pattern 1
  } else if (prediction === pattern2Result) {
    skipNextResultForPattern2 = true;  // Skip the next result for Pattern 2
  }

  prediction = null;  // Reset prediction
}

// Start monitoring and tracking
const currentBetAmount = 100;  // Example bet amount
trackLine(currentBetAmount);




// TEST FOR ECHO TEST FOR ECHO ASDASDASDA  ASD