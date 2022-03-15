/*  
steps:  
    1. create a bigger array of pixels
    2. place pixels from original array into bigger array based on scaling factor
    3. go to each empty pixel and find it's nearest neighbor 
    4. paste nearest neighbor's data into the empty pixel
*/

let imageData;
let newImageData;
let pixels = [];
let newPixels = [];
let scalingFactor = 2;
let img = new Image();
img.src = `./sunflower.jpg`;        //change image source here to see different results.

img.onload = () => {
    let canvas = document.createElement('canvas');
    let c = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.style.border = "1px solid black";
    document.body.appendChild(canvas);
    
    let canvas2 = document.createElement('canvas');
    let c2 = canvas2.getContext('2d');
    canvas2.width = img.width * scalingFactor;
    canvas2.height = img.height * scalingFactor;
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
        applyFilter(imageData);
        c2.putImageData(newImageData, 0,0);  
    })
};

// to convert image data array to objects of individual pixels
class Pixel {
    constructor(r, g, b) {
        this.red = r;
        this.green = g;
        this.blue = b;
    }
}

function index(x,y) {   //returns index of pixel in pixels array
    return x + y * img.width;
}

//returns scaled pixel array using nearest neighbor algorithm
function scaling(oldPixelArr) {
    let newPixelArr = new Array(oldPixelArr.length * scalingFactor * scalingFactor).fill(-1);
    for(let x = 0; x< img.width; x++) {
        for(let y = 0; y< img.height; y++) {
            newPixelArr[index(x * scalingFactor, y * scalingFactor * scalingFactor)] = oldPixelArr[index(x,y)];
        }
    }
    
    return newPixelArr;
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

    newPixels = scaling(pixels, newPixels);

    //convert pixel array back to rgba array
    let newColorArr = new Uint8ClampedArray(img.width * img.height * 4 * scalingFactor * scalingFactor);
    for(let i = 0; i< newPixels.length; i++) {
        newColorArr[i * 4] = newPixels[i].red;
        newColorArr[i * 4 + 1] = newPixels[i].green;
        newColorArr[i * 4 + 2] = newPixels[i].blue;
        newColorArr[i * 4 + 3] = 255;
    }

    newImageData = new ImageData(newColorArr, img.width*scalingFactor, img.height*scalingFactor);
}