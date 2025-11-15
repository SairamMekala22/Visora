// ============================================================
// FEATURE: Focused Reading (Bionic Reading Style)
// DESCRIPTION: Bolds first letters of words to create fixation
//              points for faster, easier reading comprehension
// ============================================================

export function applyFocusedReadingToSelection() {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  if (!range.collapsed) {
    const selectedText = range.toString();
    const processedText = processText(selectedText);
    const newNode = document.createElement('span');
    newNode.innerHTML = processedText;
    range.deleteContents();
    range.insertNode(newNode);
    selection.removeAllRanges();
  }
}

function processText(text) {
  // Split the text and wrap parts of it in <b> tags as per the logic in splitWord
  // Assuming splitWord returns an array of two strings: the part to be bolded and the rest
  return text.split(/\s+/).map(word => {
    const [firstPart, secondPart] = splitWord(word);
    return `<b>${firstPart}</b>${secondPart}`;
  }).join(' ');
}

function splitWord(word) {
  // Define the logic to split the word for bolding part of it
  // Here we're bolding the first letter or first few letters of each word
  const wordLength = word.length;
  let splitIndex = wordLength <= 4 ? 1 : 4;
  return [word.substring(0, splitIndex), word.substring(splitIndex)];
}
