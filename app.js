const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

let isDrawing = false; // mouse state – whether it's pressed or not
let startX = 0, startY = 0; // starting coordinates
let selectedShape = ""; // the selected shape to be drawn
let shapesList = []; // list of drawn shapes

// color and line width
const strokeColor = document.getElementById("strokeColor");
const fillColor = document.getElementById("fillColor");
const lineWidth = document.getElementById("lineWidth");
const backgroundColorPicker = document.getElementById("backgroundColorPicker");

// initial white background
let backgroundColor = "#FFFFFF";
context.fillStyle = backgroundColor;
context.fillRect(0, 0, canvas.width, canvas.height);

// buttons
const ellipseBtn = document.getElementById("ellipseBtn");
const rectangleBtn = document.getElementById("rectangleBtn");
const lineBtn = document.getElementById("lineBtn");
const clearBtn = document.getElementById("clearBtn");
const saveBtn = document.getElementById("saveBtn");

// background color change event
backgroundColorPicker.addEventListener("input", () => {
    backgroundColor = backgroundColorPicker.value;
    setBackgroundColor();
    redrawShapes();
});

// event for clearing the canvas
clearBtn.addEventListener("click", () => {
    shapesList = [];
    backgroundColor = "#FFFFFF";
    setBackgroundColor();
});

// event for saving the drawing as an image
saveBtn.addEventListener("click", function () {
    const selectedFormat = document.getElementById("selectedFormat").value;

    let imgURL;
    if (selectedFormat === "jpeg") {
        imgURL = canvas.toDataURL("image/jpeg", 1);
    }
    else if (selectedFormat === "png") {
        imgURL = canvas.toDataURL("image/png");
    }

    const link = document.createElement("a");
    link.href = imgURL;
    link.download = "image." + selectedFormat;
    link.click();
});

// shape selection events
ellipseBtn.addEventListener("click", () => {
    selectedShape = "ellipse";
    setSelectedButton(ellipseBtn);
});
rectangleBtn.addEventListener("click", () => {
    selectedShape = "rectangle";
    setSelectedButton(rectangleBtn);
});
lineBtn.addEventListener("click", () => {
    selectedShape = "line";
    setSelectedButton(lineBtn);
});

// function to set background color
function setBackgroundColor() {
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
};

// function to mark selected shape button
function setSelectedButton(button) {
    ellipseBtn.classList.remove("selected");
    rectangleBtn.classList.remove("selected");
    lineBtn.classList.remove("selected");

    button.classList.add("selected");
}

// function to apply current color and stroke settings
function drawingStyle() {
    context.strokeStyle = strokeColor.value;
    context.fillStyle = fillColor.value;
    context.lineWidth = lineWidth.value;
}

// function to draw a shape on canvas
function drawShape(shapeType, startX, startY, endX, endY, stroke, fill, strokeWidth) {
    context.beginPath();

    context.strokeStyle = stroke;
    context.fillStyle = fill;
    context.lineWidth = strokeWidth;

    if (shapeType === "ellipse") {
        const centerX = (startX + endX) / 2;
        const centerY = (startY + endY) / 2;
        const radiusX = Math.abs(endX - startX) / 2;
        const radiusY = Math.abs(endY - startY) / 2;
        context.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);

    } else if (shapeType === "rectangle") {
        const rectWidth = endX - startX;
        const rectHeight = endY - startY;
        context.rect(startX, startY, rectWidth, rectHeight);
    } else if (shapeType === "line") {
        context.moveTo(startX, startY);
        context.lineTo(endX, endY);
    }

    context.stroke();

    // fill shape if applicable
    if (shapeType === "ellipse" || shapeType === "rectangle") {
        context.fill();
    }
}

// function to redraw all stored shapes
function redrawShapes() {
    setBackgroundColor();
    shapesList.forEach((shape) => {
        drawShape(
            shape.shapeType,
            shape.startX,
            shape.startY,
            shape.endX,
            shape.endY,
            shape.stroke,
            shape.fill,
            shape.strokeWidth
        );
    });
}

// mouse down event – start drawing
canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    startX = e.offsetX;
    startY = e.offsetY;
    drawingStyle();
});

// mouse move event – draw preview while dragging
canvas.addEventListener("mousemove", (e) => {
    if (isDrawing) {
        const endX = e.offsetX;
        const endY = e.offsetY;

        redrawShapes();
        drawShape(selectedShape, startX, startY, endX, endY, strokeColor.value, fillColor.value, lineWidth.value);
    }
});

// mouse up event – finalize shape
canvas.addEventListener("mouseup", (e) => {
    if (isDrawing) {
        const endX = e.offsetX;
        const endY = e.offsetY;

        shapesList.push({
            shapeType: selectedShape,
            startX,
            startY,
            endX,
            endY,
            stroke: strokeColor.value,
            fill: fillColor.value,
            strokeWidth: lineWidth.value
        });

        redrawShapes();
        isDrawing = false;
    }
});


