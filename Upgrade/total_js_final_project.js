let message = "Hey, isn't it time for an upgrade?";   
let index = 0; // Index of the current character being displayed
let lastMillis = 0; 
let yesButtons = []; // Array to store multiple "Yes" buttons
let buttonWidth = 120; 
let buttonHeight = 60; 
let noButton; 
let bgColor = [0, 0, 255]; // Background initially blue
let textColor = [255, 255, 255]; // Text initially white
let flashing = false; // Controls the flashing effect
let shaking = false; // Controls the shaking effect
let flashStartTime = 0; // Stores the start time of the flash
let flashDuration = 200; // Flash duration in milliseconds
let shakeDuration = 500; // Shake duration in milliseconds
let shakeStartTime = 0; // Stores the start time of the shake
let noClickCount = 0; // Tracks the number of "No" button clicks
let maxNoClicks = 3; 
let maxButtonSize = 200; 
let Sound1;
let Sound2; 
let Sound3; 
let upgradeMessage = "Upgrade successfully,further upgrade?";

function preload(){
  PressStart2P = loadFont('data/PressStart2P-Regular.ttf');  
  Sound1 = loadSound('data/powerUp.wav'); 
  Sound2 = loadSound('data/2.mp3');
  Sound3=loadSound('data/3.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight); 
  textFont(PressStart2P); 
  textSize(25); 

  
  // Create the initial "Yes" button
  createYesButton(width / 2 - buttonWidth - 190, height / 2 + 70);

  // Create the "No" button
  noButton = createButton('No');
  noButton.position(width / 2 + 190, height / 2 + 70); 
  styleButton(noButton); 
  noButton.size(buttonWidth, buttonHeight); 
  noButton.mousePressed(noClicked); // Define behavior when the "No" button is clicked
}

function draw() {
  background(bgColor); 
  
  // Add first line text
  textSize(10); 
  text("When your software needs to be upgraded,please make your choice.", width / 2, height / 2 - 50); 
  textSize(25); // Restore the size for the main text
  fill(textColor); 
  textAlign(CENTER, CENTER); 

  // Check the duration of the flashing effect if it has started（this effect ask Chatgpt）
  if (flashing) {
    let currentTime = millis(); // Get the current time
    if (currentTime - flashStartTime > flashDuration) {
      endFlash(); // End the flash and restore normal background
    }
  }

  //shaking effect（this effect ask Chatgpt）
  if (shaking) {
    let currentTime = millis(); // Get the current time
    if (currentTime - shakeStartTime < shakeDuration) {
      translate(random(-10, 10), random(-10, 10)); // Apply random translations to simulate shaking
    } else {
      shaking = false; // End the shaking after the duration is over
    }
  }

  // typeface effect(https://editor.p5js.org/cfoss/sketches/SJggPXhcQ)
  text(message.substring(0, index), width / 2, height / 2);
  // Check time to determine if the index should be increased 
  let currentTime = millis(); // time in milliseconds
  if (millis() > lastMillis + 50) {//Check if 50 milliseconds have passed
		index = index + 1;//display next word
    lastMillis = millis();// Update the last time
  }

  // limited  "Yes" buttons size(chatgpt)
  for (let i = 1; i < yesButtons.length; i++) { // Start from the second button
    let btn = yesButtons[i];
    // Limit the maximum size and ensure the buttons don't exceed the boundaries
    let newWidth = constrain(btn.size().width + 14, 0, maxButtonSize);
    let newHeight = constrain(btn.size().height + 6, 0, maxButtonSize);
    btn.size(newWidth, newHeight); // Update the button size
  }
}

// Function to create "Yes" buttons
function createYesButton(x, y) {
  let yesButton = createButton('Yes');
  yesButton.position(x, y); 
  styleButton(yesButton);
  yesButton.size(buttonWidth, buttonHeight); 
  yesButton.mousePressed(reloadPage); // Reload the page when "Yes" button is clicked
  yesButtons.push(yesButton); // Add the button to the array
}

//click 'yes' Reload the current page
function reloadPage() {
  message = upgradeMessage; 
  index = 0;
  Sound3.play();
}

// Update the canvas size when the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Function to apply button styling
function styleButton(button) {
  button.style('background-color', 'rgb(0, 0, 255)'); 
  button.style('color', 'white'); 
  button.style('border', '3px solid white'); 
  button.style('border-radius', '20px'); 
  button.style('font-family', 'PressStart2P');
  button.style('font-size', '15px'); 
}


// Function to handle clicks on the "No" button
function noClicked() {
  noClickCount++; // Increase the click count
  // Trigger flashing and shaking effects
  flashing = true;
  shaking = true;
  flashStartTime = millis(); // Record the start time of the flash
  shakeStartTime = millis(); // Record the start time of the shake
  bgColor = [0, 0, 255]; 
  textColor = [255, 255, 255]; // Keep the text white for now

  //SOUND
  if (noClickCount === 4) {
    Sound2.loop(); 
  } else {
    Sound1.play(); 
  }

  // Generate a new "Yes" button for the first 2 clicks（gpt）
  if (noClickCount <= maxNoClicks) {
    let newX = random(0, windowWidth - buttonWidth); 
    let newY = random(0, windowHeight - buttonHeight); 
    createYesButton(newX, newY); // Create the new "Yes" button
  }
  // After the 2th click, start generating "Yes" buttons continuously
  if (noClickCount === maxNoClicks + 1) {
   createUnlimitedYesButtons();
  }
}
// Automatically generate buttons "Yes" buttons
function createUnlimitedYesButtons() {
  // Use setInterval to keep generating new "Yes" buttons
  setInterval(() => {
    let newX = random(0, windowWidth - buttonWidth); // Random X position
    let newY = random(0, windowHeight - buttonHeight); // Random Y position
    createYesButton(newX, newY); // Create the new "Yes" button
  }, 800); // Time for generate a new button 
}

// Function to end the flashing and switch to white background with blue text
function endFlash() {
  flashing = false; // Stop the flashing effect
  bgColor = [255, 255, 255]; 
  textColor = [0, 0, 255]; 

  // "Yes" buttons style 
  for (let yesButton of yesButtons) {
    yesButton.style('background-color', 'white'); 
    yesButton.style('color', 'rgb(0, 0, 255)'); 
    yesButton.style('border', '3px solid rgb(0, 0, 255)'); 
  }

  // "No" button style
  noButton.style('background-color', 'white'); 
  noButton.style('color', 'rgb(0, 0, 255)'); 
  noButton.style('border', '3px solid rgb(0, 0, 255)'); 
}