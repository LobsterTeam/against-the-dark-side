/**
 * Created by endre on 05.11.15.
 */

/**
 * Generates random gauss distributed numbers based on uniformly
 * distributed numbers between 0 and 1.
 *
 * To adjust the returned numbers to a certain standard deviation and mean,
 * multiply the returned number by the new standard deviation, then add the mean.
 *
 * Example: customStdDev * randomGauss() + customMean
 *
 * This is an experimentally devised procedure that is very close to the actual normal distribution.
 *
 * It uses the formula devised by Knuth and Marsaglia.
 *
 * @returns {number} a number from negative, infinity to infinity, but with mean at 0, and standard deviation at 1.
 */
function randomGauss() {
    "use strict";
    // See http://c-faq.com/lib/gaussian.html
    // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random

    var v1, v2, S;

    do {
        v1 = 2 * Math.random() - 1;
        v2 = 2 * Math.random() - 1;
        S = v1 * v1 + v2 * v2;
    } while(S >= 1 || S == 0);

    // Ideally alternate between v1 and v2
    return v1 * Math.sqrt(-2 * Math.log(S) / S);
}

/**
 * Generates random data based on a generator and validator.
 *
 * @param {Number} count number of data elements
 * @param {Function} generator a function that generates data
 * @param {Function} validator a function that validates the generated data, returns Boolean
 * @param {Number} [maxTriesMultiplicator=2] how many times per element should we try to generate and validate a data?
 */
function generateRandomData(count, generator, validator, maxTriesMultiplicator) {
    "use strict";
    var dataList = [];

    if (maxTriesMultiplicator === undefined) {
        maxTriesMultiplicator = 2;
    }

    var maxTries = maxTriesMultiplicator * count;

    if (validator === undefined) {
        validator = function() {
            return true;
        };
    }
    var i = 0;
    var numTries = 0;

    while (i < count && numTries < maxTries) {
        var data = generator();

        if (validator(data)) {
            // Accept the generated data
            dataList.push(data);

            i += 1;
        }

        numTries += 1;
    }

    if (numTries == maxTries) {
        console.warn("Maximized tries, generated " + i + " items");
    }

    return dataList;
}

/**
 * Generate random 3d position using a uniform distribution.
 * Centered at center and with maxmimum spread at radius.
 *
 * @param {THREE.Vector3} center center of the distribution
 * @param {Number} radius the maximum spread
 * @returns {THREE.Vector3} a random position
 */
function randomUniformPositionMaker(center, radius) {
    "use strict";
    var pos = new THREE.Vector3();

    pos.x = radius * (2 * Math.random() - 1);
    pos.y = radius * (2 * Math.random() - 1);
    pos.z = radius * (2 * Math.random() - 1);

    pos.add(center);

    return pos;
}

/**
 * Generate a random 3d position using a Gauss distribution.
 *
 * @param {THREE.Vector3} center the mean of the distribution, most values concentrated here
 * @param {Number} radius the standard deviation, the typical spread radius, points will exceed this value
 * @returns {THREE.Vector3}
 */
function randomGaussPositionMaker(center, radius) {
    "use strict";
    var pos = new THREE.Vector3();

    pos.x = radius * randomGauss();
    pos.y = 0;
    pos.z = radius * randomGauss();

    pos.add(center);

    return pos;
}

function gauss(x, mean, stdDev) {
    "use strict";
    var areaSmoother = Math.sqrt(2*Math.PI);
    var posAndStretch = Math.pow((x - mean)/stdDev, 2)/2;

    return (1/(stdDev*areaSmoother))*Math.exp(-posAndStretch);
}
