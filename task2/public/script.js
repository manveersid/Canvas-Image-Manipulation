/*  
steps:  
    1. make an array of chosen colors
    2. find closest neighbour to each pixel from array
    3. replace that pixel with closest neighbour color from array
*/

let imageData;
let newImageData;
let pixels = [];
let img = new Image();
img.src = `./bird.jpg`;        //change image source here to see different results.
//let colorPalette = [[211, 30, 3],[215, 163, ],[209, 192, ],[54, 158, 7],[93, 181, 1] ,[49, 64, 12],[138, 63, 1],[79, 46, 57]];    
let colorPalette = [];

img.onload = () => {
    let canvas = document.createElement('canvas');
    let c = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.style.border = "1px solid black";
    document.body.appendChild(canvas);
    
    let canvas2 = document.createElement('canvas');
    let c2 = canvas2.getContext('2d');
    canvas2.width = img.width;
    canvas2.height = img.height;
    canvas2.style.border = "1px solid black";
    document.body.appendChild(canvas2);

    let button = document.createElement('button');
    document.body.appendChild(document.createElement('br'));
    document.body.appendChild(button);
    button.innerText = "Apply Filter";

    c.drawImage(img, 0, 0, img.width, img.height);
    imageData = c.getImageData( 0, 0, img.width, img.height);
    button.addEventListener('click', function() {
        button.style.display = "none";
        randomPalette();
        applyFilter(imageData);
        c2.putImageData(newImageData, 0,0);  
    })
};

function getDistance(r1, g1, b1, r2, g2, b2) {
    return Math.sqrt(Math.pow(r1-r2, 2) + Math.pow(g1-g2,2) + Math.pow(b1-b2, 2));
}

// to convert image data array to objects of individual pixels
class Pixel {
    constructor(r, g, b) {
        this.red = r;
        this.green = g;
        this.blue = b;
    }

    //returns closest color from palette
    nearestColor(arr) {
        let colorIndex = 0;
        let minDistance = getDistance(this.red, this.green, this.blue, arr[0][0], arr[0][1], arr[0][2]);
        for(let i = 1; i< arr.length; i++) {
            let distance = getDistance(this.red, this.green, this.blue, arr[i][0], arr[i][1], arr[i][2]);
            if(distance < minDistance) {
                minDistance = distance;
                colorIndex = i;
            }
        };
        return colorIndex;
    }

    //sets values of r, g and b
    setValue(r, g, b) {
        this.red = r;
        this.green = g;
        this.blue = b;
    }
}

function randomPalette() {
    for(let i = 0; i< 8; i++) {
        colorPalette.push([Math.round(Math.random() * 255), Math.round(Math.random() * 255), Math.round(Math.random() * 255)])
    }
}

function applyFilter(imageData) {

    //create pixel array for easy working
    let totalPixels = imageData.width * imageData.height;
    let rgba = imageData.data;
    for(let i = 0; i< totalPixels; i++) {
        let r = rgba[i * 4];
        let g = rgba[i * 4 + 1];
        let b = rgba[i * 4 + 2];

        pixels.push( new Pixel(r, g, b) );
    }

    //iterate over each pixel and find it's nearest neighbour
    //then change that pixel's rgb value to the neighbour's rgb value
    for(let i = 0; i< pixels.length; i++) {
        let nearestColor = colorPalette[pixels[i].nearestColor(colorPalette)];
        pixels[i].setValue(nearestColor[0], nearestColor[1], nearestColor[2]);
    };

    //convert pixel array back to rgba array
    let newColorArr = new Uint8ClampedArray(img.width * img.height * 4);
    for(let i = 0; i< pixels.length; i++) {
        newColorArr[i * 4] = pixels[i].red;
        newColorArr[i * 4 + 1] = pixels[i].green;
        newColorArr[i * 4 + 2] = pixels[i].blue;
        newColorArr[i * 4 + 3] = 255;
    }

    newImageData = new ImageData(newColorArr, img.width, img.height);
}