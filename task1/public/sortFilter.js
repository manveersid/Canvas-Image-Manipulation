/*
steps: 
1. get all rbg values from the picture

2. sort them according to their brightness
    a) find brightness of each pixel
        a.1) make a 2D array with each pixel's values grouped together 
        a.2) calculate brightness of that internal array
    
    b) sort them from max brightness to min brightness
        b.1) do selection sort on the outer array
        b.2) make a new 1D array from sorted 2D array

3. put them back together into a new picture
*/
let imageData;
let newImageData;
let img = new Image();
img.src = `./bird.jpg`;        //change image source here to see different results.


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
    let imageData = c.getImageData( 0, 0, img.width, img.height);
    button.addEventListener('click', function() {
        button.style.display = "none";
        applyFilter(imageData);
        c2.putImageData(newImageData, 0,0);        
    })

}

//gets rgba values from Image data array and returns a 2D array with structure: [[r,g,b], [r,g,b],...]
function make2DArr(imageData) {
    let colorArr2D = [];
    let totalPixels = imageData.width * imageData.height;
    let rgba = imageData.data;
    for(let i = 0; i< totalPixels; i++) {
        let r = rgba[i * 4];
        let g = rgba[i * 4 + 1];
        let b = rgba[i * 4 + 2];

        colorArr2D.push([r,g,b]);
    }
    return colorArr2D;
};

// converts single pixel's rgb value to percieved brightness value
function giveBrightness(i,arr) {
    let red, green, blue;
    for(let k = 0; k< arr[i].length; k++){
        if(k == 0) {
            red = arr[i][k];
        }
        else if(k == 1) {
            green = arr[i][k];
        }
        else {
            blue = arr[i][k];
        }
    }
   return Math.sqrt(0.299 * Math.pow(red,2) + 0.587 * Math.pow(green, 2) + 0.114 * Math.pow(blue, 2));
}

//returns a sorted array using selection sort
function selectionSort(arr) {
    for(let i = 0; i< arr.length; i++) {
        console.log(i);
        let maxBrightness = giveBrightness(i, arr);  //element with max brightness
        let maxIndex = i;   //index of element with max brightness

        for(let j = i; j< arr.length; j++) {
            //first find the brightness of current element
            if(giveBrightness(j, arr) > maxBrightness) {
                maxBrightness = giveBrightness(j, arr);    //set max to new val
                maxIndex = j;
            }
        }
        //after internal loop finishes, we will have a brightness equal to or bigger than max
        let temp = arr[i];
        arr[i] = arr[maxIndex];
        arr[maxIndex] = temp;
    }
    return arr;
};

//fills the new rgba array from sorted 2D array
function fillNewArr(sorted2DArr) {
    let newColorArr = new Uint8ClampedArray(img.width * img.height * 4);    //new rgba array to store sorted values in
    let index = 0;
    for(let i = 0; i< sorted2DArr.length; i++) {
        for(let j = 0; j< sorted2DArr[i].length; j++) {
            newColorArr[index] = sorted2DArr[i][j];
            index++;
        }
        newColorArr[index] = 255;  //the alpha value
        index++;
    }
    return newColorArr;
};

//applies the filter to the image
function applyFilter(imageData) {
    let colorArr2D = make2DArr(imageData);
    let sorted2DArr = selectionSort(colorArr2D);
    let newColorArr = fillNewArr(sorted2DArr);
    newImageData = new ImageData(newColorArr, img.width, img.height);
}