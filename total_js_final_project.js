let message = "Hey, isn't it time for an upgrade?";  
let index = 0; // Index of the current character being displayed
let typingSpeed = 100; // Time interval (ms) for each character to appear
let lastTime = 0; // Last update time
let yesButtons = []; // Array to store multiple "Yes" buttons
let buttonWidth = 120; // Width of the buttons
let buttonHeight = 60; // Height of the buttons
let noButton; // "No" button
let bgColor = [0, 0, 255]; // Background color (initially blue)
let textColor = [255, 255, 255]; // Text color (initially white)
let flashing = false; // Controls the flashing effect
let shaking = false; // Controls the shaking effect
let flashStartTime = 0; // Stores the start time of the flash
let flashDuration = 200; // Flash duration in milliseconds
let shakeDuration = 500; // Shake duration in milliseconds
let noClickCount = 0; // Tracks the number of "No" button clicks
let maxNoClicks = 5; // Maximum of 5 clicks allowed on the "No" button
let shakeStartTime = 0; // Stores the start time of the shake
let maxButtonSize = 200; // Maximum button size
let clickSound; // Sound variable
let specialSound; // Special sound for the 6th click

function preload(){
  PressStart2P = loadFont('data/PressStart2P-Regular.ttf');  
  clickSound = loadSound('data/powerUp.wav'); 
  specialSound = loadSound('data/2.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight); // Create a canvas that matches the window size
  textFont(PressStart2P); // Set the font to 'PressStart2P'
  textSize(25); // Set text size
  // Create the initial "Yes" button
  createYesButton(width / 2 - buttonWidth - 190, height / 2 + 70);

  // Create the "No" button
  noButton = createButton('No');
  noButton.position(width / 2 + 190, height / 2 + 70); // Set the button's position
  styleButton(noButton); // Apply styling to the button
  noButton.size(buttonWidth, buttonHeight); // Set the button size
  noButton.mousePressed(noClicked); // Define behavior when the "No" button is clicked
}

function draw() {
  background(bgColor); // Set the background color
  
  // Add a second line of small text
  textSize(10); // Set the text size for the second line
  text("Try to click the 'No' button, otherwise you will be stuck in a loop.", width / 2, height / 2 - 50); // Display the second line
  textSize(25); // Restore the size for the main text

  // Check the duration of the flashing effect if it has started
  if (flashing) {
    let currentTime = millis(); // Get the current time
    if (currentTime - flashStartTime > flashDuration) {
      endFlash(); // End the flash and restore normal background
    }
  }

  // Handle screen shaking effect if it's active
  if (shaking) {
    let currentTime = millis(); // Get the current time
    if (currentTime - shakeStartTime < shakeDuration) {
      translate(random(-10, 10), random(-10, 10)); // Apply random translations to simulate shaking
    } else {
      shaking = false; // End the shaking after the duration is over
    }
  }

  fill(textColor); // Set the text color
  textAlign(CENTER, CENTER); // Align the text to the center

  // Display characters up to the current index
  text(message.substring(0, index), width / 2, height / 2);
  // Check time to determine if the index should be increased (for typewriter effect)
  let currentTime = millis(); // Get the current time in milliseconds
  if (currentTime - lastTime > typingSpeed) {
    if (index < message.length) {
      index++; // Increase the index to show the next character
      lastTime = currentTime; // Update the last time
    }
  }

  // Update the size of all "Yes" buttons
  for (let i = 1; i < yesButtons.length; i++) { // Start from the second button
    let btn = yesButtons[i];
    // Limit the maximum size and ensure the buttons don't exceed the boundaries
    let newWidth = constrain(btn.size().width + 0.5, 0, maxButtonSize);
    let newHeight = constrain(btn.size().height + 0.5, 0, maxButtonSize);
    btn.size(newWidth, newHeight); // Update the button size
  }
}

// Function to create "Yes" buttons
function createYesButton(x, y) {
  let yesButton = createButton('Yes');
  yesButton.position(x, y); // Set the button's position
  styleButton(yesButton); // Apply styling to the button
  yesButton.size(buttonWidth, buttonHeight); // Set the button size
  yesButton.mousePressed(reloadPage); // Reload the page when "Yes" button is clicked
  yesButtons.push(yesButton); // Add the button to the array
}

// Update the canvas size when the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Function to apply button styling
function styleButton(button) {
  button.style('background-color', 'rgb(0, 0, 255)'); // Set the button background color to blue
  button.style('color', 'white'); // Set the text color to white
  button.style('border', '3px solid white'); // Set the border to white
  button.style('border-radius', '20px'); // Add rounded corners
  button.style('font-family', 'PressStart2P'); // Set the font to 'PressStart2P'
  button.style('font-size', '15px'); // Set the font size
}

// Function to reload the page when "Yes" button is clicked
function reloadPage() {
  location.reload(); // Reload the current page
}

// Function to handle clicks on the "No" button
function noClicked() {
  noClickCount++; // Increase the click count
  // Trigger flashing and shaking effects
  flashing = true;
  shaking = true;
  flashStartTime = millis(); // Record the start time of the flash
  shakeStartTime = millis(); // Record the start time of the shake
  bgColor = [0, 0, 255]; // Set the background to blue
  textColor = [255, 255, 255]; // Keep the text white for now

  if (noClickCount === 6) {
    specialSound.loop(); // Play a special sound on the 6th click
  } else {
    clickSound.play(); // Play the regular sound for other clicks
  }

  // Generate a new "Yes" button for the first 5 clicks
  if (noClickCount <= maxNoClicks) {
    let newX = random(0, windowWidth - buttonWidth); // Random X position
    let newY = random(0, windowHeight - buttonHeight); // Random Y position
    createYesButton(newX, newY); // Create the new "Yes" button
  }

  // After the 6th click, start generating "Yes" buttons continuously
  if (noClickCount === maxNoClicks + 1) {
   createUnlimitedYesButtons();
  }
}

// Function to continuously create "Yes" buttons
function createUnlimitedYesButtons() {
  // Use setInterval to keep generating new "Yes" buttons
  setInterval(() => {
    let newX = random(0, windowWidth - buttonWidth); // Random X position
    let newY = random(0, windowHeight - buttonHeight); // Random Y position
    createYesButton(newX, newY); // Create the new "Yes" button
  }, 1500); // Generate a new button every 1.5 seconds
}

// Function to end the flashing and switch to white background with blue text
function endFlash() {
  flashing = false; // Stop the flashing effect
  bgColor = [255, 255, 255]; // Set the background to white
  textColor = [0, 0, 255]; // Set the text color to blue

  // Update the styles of all "Yes" buttons
  for (let yesButton of yesButtons) {
    yesButton.style('background-color', 'white'); // Set button background to white
    yesButton.style('color', 'rgb(0, 0, 255)'); // Set button text to blue
    yesButton.style('border', '3px solid rgb(0, 0, 255)'); // Set the border to blue
  }

  // Update the style of the "No" button
  noButton.style('background-color', 'white'); // Set button background to white
  noButton.style('color', 'rgb(0, 0, 255)'); // Set button text to blue
  noButton.style('border', '3px solid rgb(0, 0, 255)'); // Set the border to blue
}

