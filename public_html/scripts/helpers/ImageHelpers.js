/**
 * Extract pixel values from image elements. Not guaranteed to contain exactly the same values as
 * the image file.
 * @param {HTMLImageElement} domImage an image.
 * @param {string} [pixelComponents='rgba'] the color components to extract
 * @returns {array|Uint8ClampedArray} a color array
 */
export function getPixelValues(domImage, pixelComponents) {
    "use strict";
    var canvas = document.createElement('canvas');
    canvas.width = domImage.width;
    canvas.height = domImage.height;

    var context2d = canvas.getContext('2d');
    context2d.drawImage(domImage, 0, 0, domImage.width, domImage.height);

    var imageData = context2d.getImageData(0, 0, domImage.width, domImage.height);

    var componentExtractor = [];

    if (pixelComponents === undefined) {
        pixelComponents = 'rgba';
    }

    if (pixelComponents === 'r') { // Could extend this to other kinds of component extractors (eg. 'g', 'b','rb')
        componentExtractor = [0];
    } else if (pixelComponents === 'rg') {
        componentExtractor = [0, 1];
    } else if (pixelComponents === 'rgb') {
        componentExtractor = [0, 1, 2];
    } else if (pixelComponents === 'rgba') {
        componentExtractor = [0, 1, 2, 3];
        // return imageData.data;
    } else {
        console.error("unknown color component type");
        return [];
    }

    var imageSize = imageData.height * imageData.width;
    console.log(imageSize, imageData.data.length, imageData.data.length / 4);
    var numComponents = componentExtractor.length;

    var pixelData = new Uint8ClampedArray(imageSize * numComponents);

    for (var i = 0, i4 = 0; i < imageSize; i++, i4 += 4) {
        for (var componentIdx = 0; componentIdx < numComponents; componentIdx++) {
            pixelData[i * numComponents + componentIdx] = imageData.data[i4 + componentExtractor[componentIdx]];
        }
    }

    return pixelData;
}