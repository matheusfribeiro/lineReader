const robot = require('robotjs');
const fs = require('fs');

// Load positions from the json file
const positions = JSON.parse(fs.readFileSync('positions.json', 'utf8'));

// Function to place a bet of 100
function placeBet100(betColorPos) {
  // Select and place 100 amount on color (4 clicks of 25)
  robot.moveMouse(positions['chip 25 position'].x, positions['chip 25 position'].y);
  robot.mouseClick();

  robot.moveMouse(betColorPos.x, betColorPos.y);
  robot.mouseClick(); robot.mouseClick(); robot.mouseClick(); robot.mouseClick();

  // Place 10 on tie (1 click of chip 10)
  robot.moveMouse(positions['chip 10 position'].x, positions['chip 10 position'].y);
  robot.mouseClick();

  robot.moveMouse(positions['tie bet position'].x, positions['tie bet position'].y);
  robot.mouseClick();
}

// Function to place a bet of 150
function placeBet150(betColorPos) {
  // Select and place 150 amount (1 click of 125 + 1 click of 25)
  robot.moveMouse(positions['chip 125 position'].x, positions['chip 125 position'].y);
  robot.mouseClick();
  robot.moveMouse(betColorPos.x, betColorPos.y);
  robot.mouseClick();

  robot.moveMouse(positions['chip 25 position'].x, positions['chip 25 position'].y);
  robot.mouseClick();
  robot.moveMouse(betColorPos.x, betColorPos.y);
  robot.mouseClick();

  // Place 15 on tie (1 click of chip 10 + 1 click of chip 5)
  robot.moveMouse(positions['chip 10 position'].x, positions['chip 10 position'].y);
  robot.mouseClick();

  robot.moveMouse(positions['chip 25 position'].x, positions['chip 25 position'].y);
  robot.mouseClick();

  robot.moveMouse(positions['chip 5 position'].x, positions['chip 5 position'].y);
  robot.mouseClick();

  robot.moveMouse(positions['tie bet position'].x, positions['tie bet position'].y);
  robot.mouseClick(); robot.mouseClick(); robot.mouseClick();
}

// Function to place a bet of 200
function placeBet200(betColorPos) {
  // Select and place 200 amount (1 click of 125 + 3 clicks of 25)
  robot.moveMouse(positions['chip 125 position'].x, positions['chip 125 position'].y);
  robot.mouseClick();

  robot.moveMouse(betColorPos.x, betColorPos.y);
  robot.mouseClick();

  robot.moveMouse(positions['chip 25 position'].x, positions['chip 25 position'].y);
  robot.mouseClick();

  robot.moveMouse(betColorPos.x, betColorPos.y);
  robot.mouseClick(); robot.mouseClick(); robot.mouseClick();

  // Place 20 on tie (2 clicks of chip 10)
  robot.moveMouse(positions['chip 10 position'].x, positions['chip 10 position'].y);
  robot.mouseClick(); 
  robot.moveMouse(positions['tie bet position'].x, positions['tie bet position'].y);
  robot.mouseClick(); robot.mouseClick();
}

// Function to place a bet of 250
function placeBet250(betColorPos) {
  // Select and place 250 amount (1 click of 125 + 5 clicks of 25)
  robot.moveMouse(positions['chip 125 position'].x, positions['chip 125 position'].y);
  robot.mouseClick();

  robot.moveMouse(betColorPos.x, betColorPos.y);
  robot.mouseClick(); robot.mouseClick();



  // Place 25 on tie 
  robot.moveMouse(positions['chip 25 position'].x, positions['chip 25 position'].y);
  robot.mouseClick();

  robot.moveMouse(positions['tie bet position'].x, positions['tie bet position'].y);
  robot.mouseClick();
}

// Function to place a bet of 300
function placeBet300(betColorPos) {
  // Select and place 300 amount (1 click of 125 + 7 clicks of 25)
  robot.moveMouse(positions['chip 125 position'].x, positions['chip 125 position'].y);
  robot.mouseClick();
  robot.moveMouse(betColorPos.x, betColorPos.y);
  robot.mouseClick(); robot.mouseClick();

  robot.moveMouse(positions['chip 10 position'].x, positions['chip 10 position'].y);
  robot.mouseClick();
  robot.moveMouse(betColorPos.x, betColorPos.y);
  robot.mouseClick(); robot.mouseClick(); robot.mouseClick(); robot.mouseClick(); robot.mouseClick(); 

  // Place 30 on tie (3 clicks of chip 10)
  robot.moveMouse(positions['chip 10 position'].x, positions['chip 10 position'].y);
  robot.mouseClick(); 
  robot.moveMouse(positions['tie bet position'].x, positions['tie bet position'].y);
  robot.mouseClick(); robot.mouseClick(); robot.mouseClick();
}

// Export all functions for external use
module.exports = {
  placeBet100,
  placeBet150,
  placeBet200,
  placeBet250,
  placeBet300,
};
