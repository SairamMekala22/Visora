

let wordList = [];

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

  autoCompleteDiv.style.position = "absolute";
  autoCompleteDiv.style.border = "1px solid #d4d4d4";
  autoCompleteDiv.style.backgroundColor = "#fff";
  autoCompleteDiv.style.zIndex = "99";
  autoCompleteDiv.style.top = `${inputElement.offsetTop + inputElement.offsetHeight}px`;
  autoCompleteDiv.style.left = `${inputElement.offsetLeft}px`;
  autoCompleteDiv.style.width = `${inputElement.offsetWidth}px`;

  inputElement.parentNode.appendChild(autoCompleteDiv);

  inputElement.addEventListener("input", function () {

    let currentInput = this.value;
    let currentWords = currentInput.split(/\s+/);
    let currentWord = currentWords[currentWords.length - 1];

    while (autoCompleteDiv.firstChild) {
      autoCompleteDiv.removeChild(autoCompleteDiv.firstChild);
    }
    if (!currentWord) return false;

    let matchedWords = wordList.filter(
      (word) =>
        word.substr(0, currentWord.length).toUpperCase() ===
        currentWord.toUpperCase()
    );

    matchedWords.sort((a, b) => {
      if (a.length === b.length) {
        return a.localeCompare(b);
      }
      return a.length - b.length;
    });
    matchedWords.slice(0, 5).forEach((matchedWord) => {

      let itemDiv = document.createElement("div");

      itemDiv.innerHTML = `<strong>${matchedWord.substr(
        0,
        currentWord.length
      )}</strong>${matchedWord.substr(currentWord.length)}`;
      itemDiv.addEventListener("click", function () {

        currentWords[currentWords.length - 1] = matchedWord;
        inputElement.value = currentWords.join(" ") + " ";

        while (autoCompleteDiv.firstChild) {
          autoCompleteDiv.removeChild(autoCompleteDiv.firstChild);
        }
      });
      autoCompleteDiv.appendChild(itemDiv);
    });
  });

  document.addEventListener("click", function (e) {
    if (e.target !== inputElement && e.target.parentNode !== autoCompleteDiv) {
      while (autoCompleteDiv.firstChild) {
        autoCompleteDiv.removeChild(autoCompleteDiv.firstChild);
      }
    }
    e.stopPropagation();
  });
}

export function enableAutocomplete() {
  document
    .querySelectorAll('input[type="text"]:not([autocomplete="on"])')
    .forEach((inputElement) => {
      createAutocomplete(inputElement);
    });
}
