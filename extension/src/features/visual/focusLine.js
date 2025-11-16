

let focusLine = null;
let focusTriangle = null;
let focusLineTop = null;
let focusLineBottom = null;

export function focusLineEnabled(enabled) {
  if (enabled) {
    if (!focusLine) {
      // Create the main focus line (semi-transparent)
      focusLine = document.createElement("div");
      focusLine.id = "visora-focus-line"; // Add ID to prevent conflicts
      focusLine.style.position = "fixed";
      focusLine.style.left = 0;
      focusLine.style.right = 0;
      focusLine.style.height = "2px";
      focusLine.style.backgroundColor = "rgba(59, 130, 246, 0.6)"; // Semi-transparent blue
      focusLine.style.pointerEvents = "none";
      focusLine.style.zIndex = "999999";
      focusLine.style.boxShadow = "0 0 8px rgba(59, 130, 246, 0.8)"; // Glow effect
      focusLine.style.visibility = "visible"; // Ensure it's always visible
      document.body.appendChild(focusLine);

      // Create top border line
      focusLineTop = document.createElement("div");
      focusLineTop.id = "visora-focus-line-top"; // Add ID
      focusLineTop.style.position = "fixed";
      focusLineTop.style.left = 0;
      focusLineTop.style.right = 0;
      focusLineTop.style.height = "1px";
      focusLineTop.style.backgroundColor = "rgba(59, 130, 246, 0.3)";
      focusLineTop.style.pointerEvents = "none";
      focusLineTop.style.zIndex = "999999";
      focusLineTop.style.visibility = "visible"; // Ensure it's always visible
      document.body.appendChild(focusLineTop);

      // Create bottom border line
      focusLineBottom = document.createElement("div");
      focusLineBottom.id = "visora-focus-line-bottom"; // Add ID
      focusLineBottom.style.position = "fixed";
      focusLineBottom.style.left = 0;
      focusLineBottom.style.right = 0;
      focusLineBottom.style.height = "1px";
      focusLineBottom.style.backgroundColor = "rgba(59, 130, 246, 0.3)";
      focusLineBottom.style.pointerEvents = "none";
      focusLineBottom.style.zIndex = "999999";
      focusLineBottom.style.visibility = "visible"; // Ensure it's always visible
      document.body.appendChild(focusLineBottom);

      // Create the triangle pointer
      focusTriangle = document.createElement("div");
      focusTriangle.id = "visora-focus-triangle"; // Add ID
      focusTriangle.style.position = "fixed";
      focusTriangle.style.width = "0";
      focusTriangle.style.height = "0";
      focusTriangle.style.borderLeft = "8px solid transparent";
      focusTriangle.style.borderRight = "8px solid transparent";
      focusTriangle.style.borderBottom = "8px solid rgba(59, 130, 246, 0.8)";
      focusTriangle.style.zIndex = "1000000";
      focusTriangle.style.pointerEvents = "none";
      focusTriangle.style.filter = "drop-shadow(0 0 3px rgba(59, 130, 246, 0.6))";
      focusTriangle.style.visibility = "visible"; // Ensure it's always visible
      document.body.appendChild(focusTriangle);
    }
    // Event listener to update position of focus line and triangle
    document.addEventListener("mousemove", function (e) {
      updateFocusLine(e, focusLine, focusTriangle, focusLineTop, focusLineBottom);
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
    if (focusLineTop) {
      focusLineTop.remove();
      focusLineTop = null;
    }
    if (focusLineBottom) {
      focusLineBottom.remove();
      focusLineBottom = null;
    }
  }
}

function updateFocusLine(e, focusLine, focusTriangle, focusLineTop, focusLineBottom) {
  if (focusLine !== null && focusTriangle !== null) {
    // Use clientY for vertical position to avoid issues with scrolling
    const yPosition = e.clientY;

    // Update main focus line position to follow the mouse cursor
    focusLine.style.top = `${yPosition}px`;

    // Update top border line (20px above)
    if (focusLineTop) {
      focusLineTop.style.top = `${yPosition - 20}px`;
    }

    // Update bottom border line (20px below)
    if (focusLineBottom) {
      focusLineBottom.style.top = `${yPosition + 20}px`;
    }

    // Update triangle position
    focusTriangle.style.left = `${e.clientX - 8}px`;
    focusTriangle.style.top = `${yPosition - 8}px`;
  }
}
