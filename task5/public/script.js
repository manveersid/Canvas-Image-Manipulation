/*  
steps:  
    1. get data from the image and draw it
    2. make an array of pixel objects out of rgba array for easier changes
    3. apply Floyd–Steinberg dithering on it ( https://en.wikipedia.org/wiki/Floyd%E2%80%93Steinberg_dithering )
    4. make a new rgba array from modified pixel array
    5. draw the image onto a new canvas
*/

let imageData;
let newImageData;
let pixels = [];
let img = new Image();
let grayScaleLevel = 1;
img.src = `./David.jpg`;        //change image source here to see different results.

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

    c.filter = `grayscale(${grayScaleLevel})`;
    c.drawImage(img, 0, 0, img.width, img.height);
    imageData = c.getImageData( 0, 0, img.width, img.height);
    button.addEventListener('click', function() {
        button.style.display = "none";
        applyFilter(imageData);
        c2.putImageData(newImageData, 0,0);  
    })
};

function index(x,y) {   //returns index of pixel in pixels array
    return x + y * img.width;
}

function changeOtherPixels(row,col, errorObj, frac) {       //makes changes to neighbouring pixels
    pixels[index(row,col)].red = pixels[index(row,col)].red + (errorObj.red * frac);
    pixels[index(row,col)].blue = pixels[index(row,col)].blue + (errorObj.blue * frac);
    pixels[index(row,col)].green = pixels[index(row,col)].green + (errorObj.green * frac);
}

// to convert image data array to objects of individual pixels
class Pixel {
    constructor(r, g, b) {
        this.red = r;
        this.green = g;
        this.blue = b;
    }

    find_closest_palette_color(factor) {
        return {
            red : Math.round(factor * this.red / 255) * (255/factor),
            blue : Math.round(factor * this.blue / 255) * (255/factor),
            green : Math.round(factor * this.green / 255) * (255/factor)
        }
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

    //iterate over each pixel and apply the dithering algorithm
    for(let y = 0; y < img.height-1; y++) {
        for(let x = 1; x < img.width-1; x++) {
            let oldPixel = pixels[index(x,y)];      //get old pixel
            let newPixel = oldPixel.find_closest_palette_color(1);     //make changes to old pixel
            pixels[index(x,y)] = newPixel;  //change old pixel in pixels array to new pixel

            //get the quantum error for each pixel
            let errorObj = {
                red: oldPixel.red - newPixel.red,
                blue: oldPixel.blue - newPixel.blue,
                green: oldPixel.green - newPixel.green
            }

            changeOtherPixels(x+1, y, errorObj, 7/16);
            changeOtherPixels(x-1, y+1, errorObj, 3/16);
            changeOtherPixels(x, y+1, errorObj, 5/16);
            changeOtherPixels(x+1, y+1, errorObj, 1/16);
        }        
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