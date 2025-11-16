

let wordList = [];

// Load word list
fetch(chrome.runtime.getURL("assets/words.json"))
  .then((response) => response.json())
  .then((json) => {
    wordList = Object.keys(json);
    console.log(wordList);
  })
  .catch((error) => console.error("Error loading word list:", error));

function createAutocomplete(inputElement) {
  let autoCompleteDiv = document.createElement("div");
  autoCompleteDiv.className = "autocomplete-items";
  // Position the autocomplete items below the input element
  autoCompleteDiv.style.position = "absolute";
  autoCompleteDiv.style.border = "1px solid #d4d4d4";
  autoCompleteDiv.style.backgroundColor = "#fff";
  autoCompleteDiv.style.zIndex = "99";
  autoCompleteDiv.style.top = `${inputElement.offsetTop + inputElement.offsetHeight}px`;
  autoCompleteDiv.style.left = `${inputElement.offsetLeft}px`;
  autoCompleteDiv.style.width = `${inputElement.offsetWidth}px`;

  inputElement.parentNode.appendChild(autoCompleteDiv);

  inputElement.addEventListener("input", function () {
    // Get the current word the user is typing (the last word in the input)
    let currentInput = this.value;
    let currentWords = currentInput.split(/\s+/); // Split the input into words
    let currentWord = currentWords[currentWords.length - 1]; // Get the last word
    // Clear any existing autocomplete items
    while (autoCompleteDiv.firstChild) {
      autoCompleteDiv.removeChild(autoCompleteDiv.firstChild);
    }
    if (!currentWord) return false;
    // Filter the wordList based on the current word
    let matchedWords = wordList.filter(
      (word) =>
        word.substr(0, currentWord.length).toUpperCase() ===
        currentWord.toUpperCase()
    );
    // Sort the matched words by length, and then alphabetically for words of the same length
    matchedWords.sort((a, b) => {
      if (a.length === b.length) {
        return a.localeCompare(b); // Alphabetical order for words of the same length
      }
      return a.length - b.length; // Shortest words first
    }); // Limit the number of suggestions
    matchedWords.slice(0, 5).forEach((matchedWord) => {
      // Create a DIV element for each matching element
      let itemDiv = document.createElement("div");
      // Make the matching letters bold
      itemDiv.innerHTML = `<strong>${matchedWord.substr(
        0,
        currentWord.length
      )}</strong>${matchedWord.substr(currentWord.length)}`;
      itemDiv.addEventListener("click", function () {
        // Replace the last word with the selected word from autocomplete suggestions
        currentWords[currentWords.length - 1] = matchedWord;
        inputElement.value = currentWords.join(" ") + " "; // Add a space after the inserted word
        // Clear the items
        while (autoCompleteDiv.firstChild) {
          autoCompleteDiv.removeChild(autoCompleteDiv.firstChild);
        }
      });
      autoCompleteDiv.appendChild(itemDiv);
    });
  });

  // Close the list when the user clicks elsewhere
  document.addEventListener("click", function (e) {
    if (e.target !== inputElement && e.target.parentNode !== autoCompleteDiv) {
      while (autoCompleteDiv.firstChild) {
        autoCompleteDiv.removeChild(autoCompleteDiv.firstChild);
      }
    }
    e.stopPropagation(); // Stop the click event from closing the div prematurely
  });
}

// Query all text inputs and attach the autocomplete
export function enableAutocomplete() {
  document
    .querySelectorAll('input[type="text"]:not([autocomplete="on"])')
    .forEach((inputElement) => {
      createAutocomplete(inputElement);
    });
}
