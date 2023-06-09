// Get the necessary elements from the DOM
const asciiInput = document.getElementById("asciiInput");
const logDiv = document.getElementById('logDiv');
const fromColor = document.getElementById('fromColor');
const toColor = document.getElementById('toColor');
const gradient = document.getElementById('gradient')

// Define the number of gradient steps
let numSteps = 0;
var outputHTML;

// Define a function to generate the gradient color at a given step
function getGradientColor(step) {
  const fromRGB = hexToRgb(fromColor.value);
  const toRGB = hexToRgb(toColor.value);
  const r = Math.floor(fromRGB.r + (toRGB.r - fromRGB.r) * (step / numSteps));
  const g = Math.floor(fromRGB.g + (toRGB.g - fromRGB.g) * (step / numSteps));
  const b = Math.floor(fromRGB.b + (toRGB.b - fromRGB.b) * (step / numSteps));
  return rgbToHex(r, g, b);
}

// Define a function to convert a hex color string to an RGB object
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

// Define a function to convert an RGB object to a hex color string
function rgbToHex(r, g, b) {
    // Ensure that r, g, and b are between 0 and 255
    r = Math.max(0, Math.min(r, 255));
    g = Math.max(0, Math.min(g, 255));
    b = Math.max(0, Math.min(b, 255));
  
    const hexR = r.toString(16).padStart(2, '0');
    const hexG = g.toString(16).padStart(2, '0');
    const hexB = b.toString(16).padStart(2, '0');
    return `${hexR}${hexG}${hexB}`;
  }

// Define a function to update the log div with the ASCII input and gradient colors
function updateLogDiv() {
  // Get the input text and split it into lines
  const inputText = asciiInput.value;
  const lines = inputText.split('\n');
  numSteps = lines.length;

  // Generate the output HTML with the gradient colors
  let outputHTML = `con_filter_enable 1
con_filter_text_out "Setting channel"\n`;
  outputHTML += `log_color Console ${getGradientColor(0)}FF\n`;
  lines.forEach((line, i) => {
    if (i > 0) {
      outputHTML += `log_color Console ${getGradientColor(i - 1)}FF\n`;
    }
    outputHTML += `echo "${line}"\n`;
    if (line.length > 200) {
      document.getElementById('note').style.display = "block";
    }
  });
  outputHTML += `log_color Console FFFFFFFF\n`;
  // Update the log div with the output HTML
  logDiv.innerText = outputHTML;
}


function selectText(id){
	var sel, range;
	var el = document.getElementById(id); //get element id
	if (window.getSelection && document.createRange) { //Browser compatibility
	  sel = window.getSelection();
	  if(sel.toString() == ''){ //no text selection
		 window.setTimeout(function(){
			range = document.createRange(); //range object
			range.selectNodeContents(el); //sets Range
			sel.removeAllRanges(); //remove all ranges from selection
			sel.addRange(range);//add Range to a Selection.
		},1);
	  }
	}else if (document.selection) { //older ie
		sel = document.selection.createRange();
		if(sel.text == ''){ //no text selection
			range = document.body.createTextRange();//Creates TextRange object
			range.moveToElementText(el);//sets Range
			range.select(); //make selection.
		}
	}
}

function randomizeColors() {
  var letters = '0123456789ABCDEF';
  var randomColor = '#';
  var randomColor2 = '#';
  for (var i = 0; i < 6; i++) {
    randomColor += letters[Math.floor(Math.random() * 16)];
    randomColor2 += letters[Math.floor(Math.random() * 16)];
  }
  fromColor.value = randomColor;
  toColor.value = randomColor2;
  gradient.style.background = `linear-gradient(to right, ${fromColor.value}, ${toColor.value})`
  updateLogDiv();
}

fromColor.addEventListener('input', function() {
  gradient.style.background = `linear-gradient(to right, ${fromColor.value}, ${toColor.value})`
 });
toColor.addEventListener('input', function() {
  gradient.style.background = `linear-gradient(to right, ${fromColor.value}, ${toColor.value})`
 });