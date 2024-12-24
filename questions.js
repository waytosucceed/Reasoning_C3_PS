var questions = [];
var i = 0;
var count = 0;
var score = 0;
var Ansgiven = []; // Store answers given by the user
var previousQuestionIndex = null; // Track the previously displayed question
var topicName = ''; // Variable to store the topic name
const submitSound =document.getElementById("submit-sound");

const uniqueKey = "Reasoning_C3";

// Helper function to save data in local storage under the unique key
function saveToLocalStorage(key, value) {
  let storageData = JSON.parse(localStorage.getItem(uniqueKey)) || {};
  storageData[key] = value;
  localStorage.setItem(uniqueKey, JSON.stringify(storageData));
}

// Helper function to get data from local storage under the unique key
function getFromLocalStorage(key) {
  let storageData = JSON.parse(localStorage.getItem(uniqueKey)) || {};
  return storageData[key];
}
var modal = document.getElementById("myModal");
var modalContent = document.getElementById("modalContent");
var seeMoreBtn = document.getElementById("seeMoreBtn");
var closeBtn = document.getElementsByClassName("close-btn")[0];

// Function to check content availability and show/hide button
function checkContentAvailability() {
    var questionContent = questions[0].question; // You can change this logic to match your specific use case

    // Check if the question and options are available
    if (!questionContent || questions[0].options.length === 0) {
        seeMoreBtn.style.display = "none";  // Hide the button if no content
    } else {
        seeMoreBtn.style.display = "block"; // Show the button if content is available
    }
}

// Show the modal when the "See More" button is clicked


// Close the modal when the close button is clicked
closeBtn.onclick = function() {
    modal.style.display = "none";
}

// Close the modal when the user clicks outside of the modal
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Call the checkContentAvailability function on page load
window.onload = checkContentAvailability;

// Fetch the questions from the JSON file
fetch('questions.json')
  .then(response => response.json())
  .then(data => {
    // Get the selected topic from the URL
    const urlParams = new URLSearchParams(window.location.search);
    topicName = urlParams.get('topic'); // Store topic name for later use

    // Find the questions for the selected topic
    const selectedTopic = data.topics.find(t => t.heading === topicName);

    if (selectedTopic) {
      questions = selectedTopic.questions; // Access the questions array for the selected topic
      count = questions.length;

      // // Store total number of questions in localStorage
      // localStorage.setItem(topicName + '_totalQuestions', count);

      // Store total number of questions in localStorage
      saveToLocalStorage(topicName + '_totalQuestions', count);

      // Load the heading from the selected topic
      document.getElementById('heading').innerText = topicName || 'PS'; // Set default heading if not provided
      loadButtons();
      loadQuestion(i);

      // Store topics in local storage for the results page
      const topics = JSON.parse(localStorage.getItem('topics')) || [];
      if (!topics.find(t => t.heading === topicName)) {
        topics.push(selectedTopic);
        // localStorage.setItem('topics', JSON.stringify(topics));
        saveToLocalStorage('topics', topics);

      }
    } else {
      document.getElementById('heading').innerText = 'Topic not found';
      document.getElementById('buttonContainer').innerHTML = 'No questions available for this topic.';
    }
  });

function loadButtons() {
  var buttonContainer = document.getElementById("buttonContainer");
  buttonContainer.innerHTML = ""; // Clear previous buttons
  for (var j = 0; j < questions.length; j++) {
    var btn = document.createElement("button");
    btn.className = "btnButton btn  smallbtn";
    btn.innerHTML = "Q" + (j + 1);
    btn.setAttribute("onclick", "abc(" + (j + 1) + ")");

    // // Check if the topic has been completed and disable the button if necessary
    // if (localStorage.getItem(topicName + '_completed')) {
    //   btn.classList.add("disabled-btn");
    //   btn.disabled = true;
    // }

       // Check if the topic has been completed and disable the button if necessary
       if (getFromLocalStorage(topicName + '_completed')) {
        btn.classList.add("disabled-btn");
        btn.disabled = true;
      }

    buttonContainer.appendChild(btn);
  }
  // Highlight the button for the current question
  highlightButton(i);
  // Update button styles based on answered questions
  updateButtonStyles();
}
// function checkContentAvailability() {
//   var questionContent = questions[index].content; // Check for 'content' specifically in the first question

//   // Check if the content is available in the question
//   if (!questionContent || questionContent.trim() === "") {
//       seeMoreBtn.style.display = "none";  // Hide the button if no content
//   } else {
//       seeMoreBtn.style.display = "block"; // Show the button if content is available
//   }
// }

function loadQuestion(index) {
  var randomQuestion = questions[index];

  if (!randomQuestion) {
    console.error("No question found at index:", index);
    return;
  }

  var questionContent = questions[index].content; // Check for 'content' specifically in the first question

  // Check if the content is available in the question
  if (!questionContent || questionContent.trim() === "") {
      seeMoreBtn.style.display = "none";  // Hide the button if no content
  } else {
      seeMoreBtn.style.display = "block"; // Show the button if content is available
  }

  // Set question text
  seeMoreBtn.onclick = function() {
    var content = randomQuestion.content;

    // Set the content to the modal
    modalContent.innerHTML = content;

    // Display the modal
    modal.style.display = "block";
}
  var questionElement = document.getElementById("question");
  questionElement.innerHTML = randomQuestion.question; // Set the question text

  // Check if there is a sound associated with the question
  if (randomQuestion.questionSound) {
    var soundButton = document.createElement("button");
    soundButton.className = "btn btn-sound";
    soundButton.innerText = "🔊 Play Sound";
    soundButton.onclick = function() {
      var sound = new Audio(randomQuestion.questionSound);
      sound.play();
    };
    questionElement.appendChild(soundButton);
  }


  var optionsElement = document.getElementById("options");
  optionsElement.innerHTML = ""; // Clear existing options

  // Check if any option has an image
  var hasImageOptions = randomQuestion.options.some(option => option.image);
  var hasTextOnlyOptions = randomQuestion.options.every(option => !option.image);

  // Apply layout based on content
  if (hasImageOptions) {
    
    optionsElement.classList.remove("text-only");
  } else if (hasTextOnlyOptions) {
    optionsElement.classList.add("text-only");
    
  }

  var selectedLi = null;
  var defaultBackgroundColor = "#699e19";
  // Iterate through the options and display them
  randomQuestion.options.forEach(function(option, idx) {
    var li = document.createElement("li");
    li.classList.add("option-container");
    li.setAttribute("onclick", "optionContainer()");
    li.onclick = function() {
      // If there is already a selected li, remove its style
      if (selectedLi) {
          selectedLi.style.border = "";
      }

      
      

      // Update the selectedLi variable to the currently clicked li
      selectedLi = li;
  };

    // Create the radio button for the option
    var radioButton = document.createElement("input");
    radioButton.type = "radio";
    radioButton.name = "answer";
    radioButton.value = idx;
    radioButton.style.display = "none"; // Hide the radio button

    if (option.image) {
      // Create the image element for the option
      var optionWithImage=document.getElementById("options");
      optionWithImage.style.display="flex";
      optionWithImage.style.flexDirection="column"; 
      optionWithImage.style.gap="0.5rem";
      var optionImage = document.createElement("img");
      optionImage.src = option.image;
      optionImage.alt = "Option Image";
      optionImage.style.width = "80%";
      optionImage.style.maxHeight ="100px"
      optionImage.style.height = "30%";
      optionImage.style.cursor = "pointer";
      optionImage.style.borderRadius = "12px";
      
      
      optionImage.onclick = function() {
        radioButton.checked = true;
        optionImage.style.border = "3px solid";
         // Select the corresponding radio button
        handleAnswerChange(); // Call the answer change handler
      };

      optionImage.onmouseover = function() {
        // optionImage.style.border = "5px solid black";
        if (option.sound) {
          playOptionSound(option.sound);
        }
      };

      optionImage.onmouseout = function() {
        optionImage.style.border = "none";
      };

      // Append the image to the list item
      li.appendChild(optionImage);
    } 
    else 
    {
      var selectedButton = null;
      var defaultBackgroundColor = "#699e19";
      
      var optionWithText=document.getElementById("options");
      optionWithText.style.display="flex";
      optionWithText.style.flexDirection="column";

      var optionTextButton = document.createElement("button");
      optionTextButton.className = "btnOption btn btn-option";
      optionTextButton.innerHTML = option.text;
      optionTextButton.style.marginBottom="20px";
      optionTextButton.onclick = function() {
        radioButton.checked = true; // Select the corresponding radio button
       

      // Set the background color of the clicked button to yellow
      

      // Update the selectedButton variable to the currently clicked button
      selectedButton = optionTextButton;
        handleAnswerChange(); // Call the answer change handler
      };

      // Append the text button to the list item
      li.appendChild(optionTextButton);
    }

    // Append the radio button and text button/image to the list item
    li.appendChild(radioButton);

    // Append the list item to the options container
    optionsElement.appendChild(li);
  });

  var previouslySelected = Ansgiven[index];
  if (previouslySelected !== null && previouslySelected !== undefined) {
    var previouslySelectedElement = optionsElement.querySelector('input[name="answer"][value="' + previouslySelected + '"]');
    if (previouslySelectedElement) {
      previouslySelectedElement.checked = true;
  
      // Find the corresponding button or image based on the index
      var previouslySelectedLi = previouslySelectedElement.closest('li');
  
      // Apply styling to the previously selected option
      if (previouslySelectedLi) {
        previouslySelectedLi.style.border = "3px solid";
        previouslySelectedLi.style.borderRadius = "8px";
        selectedLi = previouslySelectedLi; // Update selectedLi with the previously selected element
      }
    }
  }

  // Update button visibility based on whether an answer is selected
  updateButtonVisibility();
  // Highlight the button for the current question
  highlightButton(index);
  // Update button styles
  updateButtonStyles();

  // Update the Next button or Submit Answers button
  updateButtonText();
}


function playOptionSound(option) {
  var sound = new Audio(option);
  sound.play();
}


function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}



function capitalizeFirstLetter(string) {
  return string.charAt(0) + string.slice(1);
}


function getOptionLabel(option) {
  if (option.endsWith('.mp3')) {
    var label = option.split('/').pop().replace('.mp3', '');
    return capitalizeFirstLetter(label);
  }
  return option;
}


function handleAnswerChange() {
  // Show the Submit Answer button and hide the Next button when an answer is selected
  document.getElementById("subbtn").style.display = "inline-block";
  document.getElementById("nextbtn").style.display = "none";
}

function newques() {
  // Save the answer for the current question
  saveCurrentAnswer();

  if (i === count - 1) {
    document.getElementById("questiondiv").style.textAlign = "center";
    
    // Display results
    displayResults();    
  
    // Hide buttonContainer
    document.getElementById("buttonContainer").style.display = "none";

// // window.location.href = "./graph.html";

  } else {
    // Move to the next question
    i++;
    loadQuestion(i);
    document.getElementById("result").innerHTML = "";
    document.getElementById("subbtn").style.display = "inline-block";
    document.getElementById("nextbtn").style.display = "none";
    
    // Update button visibility and styles
    updateButtonVisibility();
    updateButtonStyles();
  }
}


// Save the answer for the current question
function saveCurrentAnswer() {
  var selectedAnswer = document.querySelector('input[name="answer"]:checked');
  if (selectedAnswer) {
    Ansgiven[i] = parseInt(selectedAnswer.value); // Store answer as an index
  } else {
    Ansgiven[i] = null; // Mark as not answered
  }
  console.log("score", score);
  saveToLocalStorage('Ansgiven', Ansgiven); // Save the updated answers array to local storage

}
function getOptionLabel(option) {
  if (option.endsWith('.mp3')) {
    var label = option.split('/').pop().replace('.mp3', '');
    document.querySelectorAll('.menu li').forEach(function(item) {
      item.style.marginBottom = '0';
    });
    return capitalizeFirstLetter(label);
  }
  return option;
}



function displayResults() {
  window.location.href = "./graph.html";

  // Calculate the score
  score = Ansgiven.reduce((total, answer, index) => {
    return answer === questions[index].answer ? total + 1 : total;
  }, 0);

  // Save score and completion status to local storage
  saveToLocalStorage(topicName + '_score', score);
  saveToLocalStorage(topicName + '_completed', 'true'); // Mark topic as completed

  var percentage = (score / count) * 100;
  var progressBarColor = "";
  var feedbackMessage = "";

  // Save report content to local storage
  var home = "<a href='./graph.html'><b class='btn btn-success next-btn-progress'>Click here to View Report</b></a><br>";
  var content = home;
  saveToLocalStorage(topicName + '_results_content', content);

  var questionsPerPage = 5;
  var numberOfPages = Math.ceil(questions.length / questionsPerPage);
  var questionContent = "";
  var paginationControls = "";

  // Iterate through the pages of questions
  for (var page = 0; page < numberOfPages; page++) {
    var start = page * questionsPerPage;
    var end = Math.min(start + questionsPerPage, questions.length);
    var pageDiv = "<div class='question-page' style='display: " + (page === 0 ? "block" : "none") + ";'><h2>Page " + (page + 1) + "</h2>";

    for (var j = start; j < end; j++) {
      var quesgroup = questions[j];
      var ques = quesgroup.question;

      // Handle correct answer
      var ans = quesgroup.options[quesgroup.answer];
      var ansContent = "";

      // Handle given answer
      var givenAnswer = Ansgiven[j] !== undefined ? quesgroup.options[Ansgiven[j]] : null;
      var givenContent = "";

      // Display the image or text label for correct answer
      ansContent = ans.image ? "<img src='" + ans.image + "' alt='Answer Image' style='width: 120px; height: 50px;'>" : getOptionLabel(ans);

      // Display the image or text label for given answer and apply red color if incorrect
      if (givenAnswer) {
        var isCorrect = Ansgiven[j] === quesgroup.answer;
        givenContent = givenAnswer.image
          ? "<img src='" + givenAnswer.image + "' alt='Given Answer Image' style='width: 120px; height: 50px;" + (isCorrect ? "" : " border: 2px solid red;") + "'>"
          : "<span style='color: " + (isCorrect ? "inherit" : "red") + ";'>" + getOptionLabel(givenAnswer) + "</span>";
      } else {
        givenContent = "<span style='color:red'>Not Answered</span>";
      }

      var num = j + 1;
      pageDiv += "Q." + num + " " + ques + "<br>" + "Correct Answer: " + ansContent + "<br>" + "Answer Given: " + givenContent + "<br><br>";
    }

    pageDiv += "</div>";
    questionContent += pageDiv;
  }

  // Pagination controls
  paginationControls = "<div class='pagination-controls' style='text-align: center; margin-top: 20px;'>";
  for (var page = 0; page < numberOfPages; page++) {
    paginationControls += "<button class='btnOption btn btn-default' onclick='showPage(" + page + ")'>" + (page + 1) + "</button> ";
  }
  paginationControls += "</div>";

  // Save question content to local storage
  saveToLocalStorage(topicName + '_question_content', questionContent);

  // Hide unnecessary elements
  document.getElementById("picdiv").innerHTML = "";
  document.getElementById("picdiv").style.display = "none";
  document.getElementById("questiondiv").style.display = "none";
  document.getElementById("nextbtn").style.textAlign = "center";

  // Play confetti animation
  confetti({
    particleCount: 200,
    spread: 70,
    origin: { y: 0.6 }
  });

  // Play well-done sound
  var sound = new Audio('./assests/sounds/well-done.mp3'); // Update with the correct path to your sound file
  sound.play();
}

// Helper function to get the label for an option (if option is a string)
function getOptionLabel(option) {
  return typeof option === 'string' ? option : option.text || '';
}

// Helper function to play sound
function playOptionSound(soundPath) {
  var sound = new Audio(soundPath);
  sound.play();
}


// Helper function to get the label for an option (if option is a string)
function getOptionLabel(option) {
  return typeof option === 'string' ? option : option.text || '';
}




function showPage(page) {
  var pages = document.querySelectorAll('.question-page');
  pages.forEach((p, index) => {
    p.style.display = index === page ? 'block' : 'none';
  });
}

function checkAnswer() {
  submitSound.play();

  saveCurrentAnswer();
  document.getElementById("subbtn").style.display = "none";
  document.getElementById("nextbtn").style.display = "inline-block";
}

function abc(x) {
  // Save the current answer before changing questions
  saveCurrentAnswer();
  i = x - 1;
  loadQuestion(i);
  document.getElementById("result").innerHTML = "";
  document.getElementById("subbtn").style.display = "inline-block";
  document.getElementById("nextbtn").style.display = "none";

  // Update button styles and visibility
  highlightButton(i);
  updateButtonStyles();
}

function updateButtonVisibility() {
  var selectedAnswer = document.querySelector('input[name="answer"]:checked');
  if (selectedAnswer) {
    document.getElementById("subbtn").style.display = "inline-block";
    document.getElementById("nextbtn").style.display = "none";
  } else {
    document.getElementById("subbtn").style.display = "none";
    document.getElementById("nextbtn").style.display = "none";
  }
}

function highlightButton(index) {
  var buttonContainer = document.getElementById("buttonContainer");
  var buttons = buttonContainer.getElementsByTagName("button");

  // Remove highlight from all buttons
  for (var j = 0; j < buttons.length; j++) {
    buttons[j].classList.remove("highlighted-btn");
  }

  // Add highlight to the current button
  if (index >= 0 && index < buttons.length) {
    buttons[index].classList.add("highlighted-btn");
  }
}

function updateButtonStyles() {
  var buttonContainer = document.getElementById("buttonContainer");
  
  if (buttonContainer) {
    var buttons = buttonContainer.getElementsByTagName("button");

    // Remove "answered-btn" class from all buttons
    for (var j = 0; j < buttons.length; j++) {
      buttons[j].classList.remove("answered-btn");
    }

    // Add "answered-btn" class to the button for the answered questions
    Ansgiven.forEach((answer, index) => {
      if (answer !== null && index >= 0 && index < buttons.length) {
        buttons[index].classList.add("answered-btn");
      }
    });
  } else {
    console.error("Button container not found");
  }
}


function updateButtonText() {
  var nextButton = document.getElementById("nextbtn");
  if (i === count - 1) {
    nextButton.innerHTML = "FINISH TEST";
    nextButton.onclick = function() {
      newques(); // Calls newques which will hide buttonContainer
    };

  } else {
    nextButton.innerHTML = "Next";
   
  }
}


