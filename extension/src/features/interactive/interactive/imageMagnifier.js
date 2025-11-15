// ============================================================
// FEATURE: Image Magnification with Zoom Lens
// DEVELOPER: Team Member 10
// DESCRIPTION: Creates a magnifying glass effect with 2x zoom
//              for detailed image inspection (visual impairment support)
// ============================================================

export function openMagnifiedImage(imageSrc) {
  // Create an underlay to dim the background content
  const underlay = document.createElement('div');
  underlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 10000;
    cursor: pointer;
  `;
  document.body.appendChild(underlay);

  // Create a container for the magnified image and append it to underlay
  const imgContainer = document.createElement('div');
  imgContainer.className = 'img-magnifier-container';
  imgContainer.style.cssText = `
    position: relative;
    width: 80%;  // Set this to the desired width
    max-width: 600px;  // Set a max-width if needed
    margin: auto;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  `;
  underlay.appendChild(imgContainer);

  // Create the magnified image itself and append it to the container
  const magnifiedImg = document.createElement('img');
  magnifiedImg.src = imageSrc;
  magnifiedImg.style.cssText = `
    width: 100%;  // Image takes the full width of its container
    height: auto;  // Height is set automatically to keep aspect ratio
    display: block;  // To prevent inline default spacing
  `;
  magnifiedImg.onload = () => {
    // Once the image is loaded, apply the magnifying glass effect
    magnify(magnifiedImg, 2);  // The second parameter is the zoom level
  };
  imgContainer.appendChild(magnifiedImg);

  // Event listener for closing the magnified image when the underlay is clicked
  underlay.addEventListener('click', function() {
    underlay.remove();
  });
}

function magnify(img, zoom) {
  var glass = document.createElement("DIV");
  glass.className = "img-magnifier-glass";
  glass.style.cssText = `
    position: absolute;
    border-radius: 50%;
    border: 3px solid #000;
    cursor: none;
    width: 100px;
    height: 100px !important;
    box-shadow: 0 0 0 7px rgba(255, 255, 255, 0.85), 0 0 7px 7px rgba(0, 0, 0, 0.25);
    background-image: url('${img.src}');
    background-repeat: no-repeat;
    background-size: ${img.width * zoom}px ${img.height * zoom}px;
    visibility: hidden;  // Hide it initially
  `;
  // Insert magnifier glass
  img.parentElement.insertBefore(glass, img);

  // Event listeners for moving the magnifier glass
  glass.addEventListener("mousemove", moveMagnifier);
  img.addEventListener("mousemove", moveMagnifier);

  // Event listeners for touch screens
  glass.addEventListener("touchmove", moveMagnifier);
  img.addEventListener("touchmove", moveMagnifier);

  function moveMagnifier(e) {
    var pos, x, y;
    e.preventDefault();  // Prevent any other actions that may occur when moving over the image
    pos = getCursorPos(e);
    x = pos.x;
    y = pos.y;
    // Prevent the magnifier glass from being positioned outside the image
    if (x > img.width - (glass.offsetWidth / zoom)) {x = img.width - (glass.offsetWidth / zoom);}
    if (x < glass.offsetWidth / zoom) {x = glass.offsetWidth / zoom;}
    if (y > img.height - (glass.offsetHeight / zoom)) {y = img.height - (glass.offsetHeight / zoom);}
    if (y < glass.offsetHeight / zoom) {y = glass.offsetHeight / zoom;}
    // Set the position of the magnifier glass
    glass.style.left = (x - glass.offsetWidth / 2) + "px";
    glass.style.top = (y - glass.offsetHeight / 2) + "px";
    // Display what the magnifier glass "sees"
    glass.style.backgroundPosition = `-${((x * zoom) - glass.offsetWidth / 2 + 3)}px -${((y * zoom) - glass.offsetHeight / 2 + 3)}px`;
    glass.style.visibility = 'visible';  // Show magnifier
  }

  function getCursorPos(e) {
    var a, x = 0, y = 0;
    e = e || window.event;
    a = img.getBoundingClientRect();
    x = e.pageX - a.left;
    y = e.pageY - a.top;
    x = x - window.pageXOffset;
    y = y - window.pageYOffset;
    return {x : x, y : y};
  }
}
