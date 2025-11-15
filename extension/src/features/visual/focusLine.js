// ============================================================
// FEATURE: Reading Focus Line Guide
// DESCRIPTION: Creates a horizontal line with triangle pointer
//              that follows cursor to assist with reading focus
// ============================================================

let focusLine = null;
let focusTriangle = null;

export function focusLineEnabled(enabled) {
  if (enabled) {
    if (!focusLine) {
      // Create the focus line
      focusLine = document.createElement("div");
      focusLine.style.position = "fixed";
      focusLine.style.left = 0;
      focusLine.style.right = 0;
      focusLine.style.height = "5px";
      focusLine.style.backgroundColor = "blue";
      focusLine.style.pointerEvents = "none";
      focusLine.style.zIndex = "9999";
      document.body.appendChild(focusLine);

      // Create the triangle
      focusTriangle = document.createElement("div");
      focusTriangle.style.position = "fixed";
      focusTriangle.style.width = "0";
      focusTriangle.style.height = "0";
      focusTriangle.style.borderLeft = "10px solid transparent"; // Adjust size as needed
      focusTriangle.style.borderRight = "10px solid transparent"; // Adjust size as needed
      focusTriangle.style.borderBottom = "10px solid blue"; // Adjust color and size as needed
      focusTriangle.style.zIndex = "10000"; // Should be above the line
      focusTriangle.style.pointerEvents = "none"; // Ignore mouse events
      document.body.appendChild(focusTriangle);
    }
    // Event listener to update position of focus line and triangle
    document.addEventListener("mousemove", function (e) {
      updateFocusLine(e, focusLine, focusTriangle);
    });
  } else {
    document.removeEventListener("mousemove", updateFocusLine);
    // Remove the focus line and triangle if they exist
    if (focusLine) {
      focusLine.remove();
      focusLine = null;
    }
    if (focusTriangle) {
      focusTriangle.remove();
      focusTriangle = null;
    }
  }
}

function updateFocusLine(e, focusLine, focusTriangle) {
  if (focusLine !== null && focusTriangle !== null) {
    // Use clientY for vertical position to avoid issues with scrolling
    const yPosition = e.clientY;

    // Update focus line position to follow the mouse cursor
    focusLine.style.top = `${yPosition}px`;

    // Update triangle position
    // The '- 10' is to account for the height of the triangle to center it vertically around the cursor
    focusTriangle.style.left = `${e.clientX - 10}px`; // Adjust '- 10' if the size of the triangle changes
    focusTriangle.style.top = `${yPosition - 10}px`; // Keep the triangle centered with the cursor
  }
}
