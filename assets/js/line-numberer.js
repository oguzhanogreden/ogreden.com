// Get references to elements
const inputPoem = document.getElementById('inputPoem');
const outputPoem = document.getElementById('outputPoem');

function addLineNumbers(poem) {
  const lines = poem.split('\n');
  const maxLineNumber = lines.length;
  const digitCount = String(maxLineNumber).length;

  return lines
    .map((line, index) => {
      const lineNumber = String(index + 1).padStart(digitCount, ' ');
      return `${lineNumber}.  ${line}`;
    })
    .join('\n');
}

// Event listener for the textarea
inputPoem.addEventListener('input', () => {
  const poem = inputPoem.value;
  const formattedPoem = addLineNumbers(poem);
  outputPoem.textContent = formattedPoem;
});