/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

//global constraints

const cluePauseTime = 600 // how long to pause in between clues
const nextClueWaitTime = 1000; // how long to wait before playing sequence
//Global Variables
var clueHoldTime = 1000; // how long to hold each clue's light/sound
var pattern = [2,3,1,4,5,6,5,4,2,3,4,6]; //keeps track of the secret pattern of button presses
var progress = 0; //represents how far along the player is in guessing the pattern 
var gamePlaying = false; // keeps track of whether the game is currently active.
var tonePlaying = false;
var volume = 0.5; // must be between 0.0 and 1.0
var guessCounter = 0;
var mistakesMade = 0; // number of mistakes player made 



function startGame(){
  //initialize the game variables
  progress=0;
  mistakesMade = 0 ;
  gamePlaying = true;
  
  //swaps the start and stop button
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  randomPattern(pattern);
  playClueSequence();
  
    
}


function stopGame(){
  gamePlaying="False";
   document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
  
}

// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2,
  5: 515,
  6: 600
  
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
    
    
  }
  
}
function stopTone(){
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext 
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)


function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
 
}

function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

function playSingleClue(btn){
  if(gamePlaying)
    {
      lightButton(btn);
     
      playTone(btn,clueHoldTime);
      setTimeout(clearButton,clueHoldTime,btn);
    }
}

function playClueSequence(){
  guessCounter = 0;
  context.resume()
  let delay = nextClueWaitTime; // set delay to initial wait time
  for(let i=0; i<=progress; i++){
    console.log("play single clue: " + pattern[i] + "in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
     clueHoldTime--
    delay += cluePauseTime;
  }
}

function loseGame(){
stopGame();
  alert("Strike 3. You lost.");
}

function winGame(){
  stopGame();
  alert("Game Over. You won!")
}

function guess(btn){
  console.log("user guessed: " + btn);
  
  if(!gamePlaying){
    return;
  }
  
  if(pattern[guessCounter] == btn){
    // win game
    if(guessCounter == progress){
      if(progress == pattern.length - 1){
        winGame();
      } 
      //increment progress, play next clue sequence
      else{
        progress++;
        playClueSequence();
      }
    }
    //increment guess counter
      else{
      guessCounter++;
    }
  }
    //incorrect guess, 3 strikes
      else{
        //loseGame();
      mistakesMade++
        if(mistakesMade < 3)
          {
            
            alert ("Strike " + mistakesMade);
             progress++;
        playClueSequence();
            
          }
        else{
          loseGame();
        }
        
            
          }
           
        
      }





function randomPattern(pattern){
 
  let currentIndex = pattern.length, randomIndex;
  
  while(currentIndex != 0){
    
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    
    [pattern[currentIndex], pattern[randomIndex]] = [pattern[randomIndex], pattern[currentIndex]];
    
  }
  return pattern
  
}

document.getElementById("showImage").onclick = function() {
    document.getElementById("theImage").style.visibility = "visible";
}
