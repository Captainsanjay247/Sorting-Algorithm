const barsContainer = document.getElementById("bars");

const algorithmSelect = document.getElementById("algorithm");
const arraySizeSelect = document.getElementById("arraySize");

const speedInput = document.getElementById("speed");
const speedValue = document.getElementById("speedValue");

const generateBtn = document.getElementById("generateBtn");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

const comparisonsEl = document.getElementById("comparisons");
const swapsEl = document.getElementById("swaps");
const timeEl = document.getElementById("time");
const statusEl = document.getElementById("status");

const customInput = document.getElementById("customInput");
const setArrayBtn = document.getElementById("setArrayBtn");

const randomBtn = document.getElementById("randomBtn");
const sortedBtn = document.getElementById("sortedBtn");
const reverseBtn = document.getElementById("reverseBtn");
const nearlyBtn = document.getElementById("nearlyBtn");

const algorithmName = document.getElementById("algorithmName");
const algorithmDescription = document.getElementById("algorithmDescription");

const bestEl = document.getElementById("best");
const averageEl = document.getElementById("average");
const worstEl = document.getElementById("worst");
const spaceEl = document.getElementById("space");
const stableEl = document.getElementById("stable");
const inplaceEl = document.getElementById("inplace");


let array = [];
let comparisons = 0;
let swaps = 0;

let isSorting = false;
let isPaused = false;
let stopRequested = false;

let startTime = 0;


/* ================= ALGORITHM INFO ================= */

const algorithmInfo = {

    bubble: {
        name: "Bubble Sort",
        description:
            "Bubble Sort repeatedly compares adjacent elements and swaps them when they are in the wrong order.",
        best: "O(n)",
        average: "O(n²)",
        worst: "O(n²)",
        space: "O(1)",
        stable: "Yes",
        inplace: "Yes"
    },

    selection: {
        name: "Selection Sort",
        description:
            "Selection Sort repeatedly finds the smallest element from the unsorted part and places it at the correct position.",
        best: "O(n²)",
        average: "O(n²)",
        worst: "O(n²)",
        space: "O(1)",
        stable: "No",
        inplace: "Yes"
    },

    insertion: {
        name: "Insertion Sort",
        description:
            "Insertion Sort builds the sorted array one element at a time by inserting each element into its correct position.",
        best: "O(n)",
        average: "O(n²)",
        worst: "O(n²)",
        space: "O(1)",
        stable: "Yes",
        inplace: "Yes"
    },

    merge: {
        name: "Merge Sort",
        description:
            "Merge Sort divides the array into smaller parts, sorts them recursively and merges the sorted parts.",
        best: "O(n log n)",
        average: "O(n log n)",
        worst: "O(n log n)",
        space: "O(n)",
        stable: "Yes",
        inplace: "No"
    },

    quick: {
        name: "Quick Sort",
        description:
            "Quick Sort selects a pivot element, partitions the array around it and recursively sorts the resulting subarrays.",
        best: "O(n log n)",
        average: "O(n log n)",
        worst: "O(n²)",
        space: "O(log n)",
        stable: "No",
        inplace: "Yes"
    },

    heap: {
        name: "Heap Sort",
        description:
            "Heap Sort builds a heap structure and repeatedly extracts the largest element to produce a sorted array.",
        best: "O(n log n)",
        average: "O(n log n)",
        worst: "O(n log n)",
        space: "O(1)",
        stable: "No",
        inplace: "Yes"
    },

    shell: {
        name: "Shell Sort",
        description:
            "Shell Sort improves insertion sort by comparing elements separated by a gradually reduced gap.",
        best: "O(n log n)",
        average: "O(n²)",
        worst: "O(n²)",
        space: "O(1)",
        stable: "No",
        inplace: "Yes"
    },

    counting: {
        name: "Counting Sort",
        description:
            "Counting Sort counts the occurrences of each value and uses those counts to construct the sorted array.",
        best: "O(n+k)",
        average: "O(n+k)",
        worst: "O(n+k)",
        space: "O(k)",
        stable: "Yes",
        inplace: "No"
    },

    radix: {
        name: "Radix Sort",
        description:
            "Radix Sort sorts numbers digit by digit using a stable sorting technique such as Counting Sort.",
        best: "O(nk)",
        average: "O(nk)",
        worst: "O(nk)",
        space: "O(n+k)",
        stable: "Yes",
        inplace: "No"
    }

};


/* ================= UPDATE INFO ================= */

function updateAlgorithmInfo() {

    const info = algorithmInfo[algorithmSelect.value];

    algorithmName.textContent = info.name;
    algorithmDescription.textContent = info.description;

    bestEl.textContent = info.best;
    averageEl.textContent = info.average;
    worstEl.textContent = info.worst;
    spaceEl.textContent = info.space;
    stableEl.textContent = info.stable;
    inplaceEl.textContent = info.inplace;
}


/* ================= GENERATE ARRAY ================= */

function generateArray(size = Number(arraySizeSelect.value)) {

    array = [];

    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 95) + 5);
    }

    comparisons = 0;
    swaps = 0;

    updateStats();
    renderBars();
    setStatus("Ready");
}


/* ================= RENDER ================= */

function renderBars(active = [], swapping = [], sorted = []) {

    barsContainer.innerHTML = "";

    array.forEach((value, index) => {

        const bar = document.createElement("div");

        bar.className = "bar";

        bar.style.height = `${value}%`;

        if (sorted.includes(index)) {
            bar.classList.add("sorted");
        }

        if (active.includes(index)) {
            bar.classList.add("comparing");
        }

        if (swapping.includes(index)) {
            bar.classList.remove("comparing");
            bar.classList.add("swapping");
        }

        barsContainer.appendChild(bar);
    });
}


/* ================= STATS ================= */

function updateStats() {

    comparisonsEl.textContent = comparisons;
    swapsEl.textContent = swaps;
}


function setStatus(text) {
    statusEl.textContent = text;
}


/* ================= SPEED ================= */

function getDelay() {

    const speed = Number(speedInput.value);

    return Math.max(5, 110 - speed);
}


speedInput.addEventListener("input", () => {

    speedValue.textContent = `${speedInput.value}%`;

});


function sleep(ms) {

    return new Promise(resolve => {

        const checkPause = () => {

            if (stopRequested) {
                resolve();
                return;
            }

            if (isPaused) {
                setTimeout(checkPause, 50);
                return;
            }

            resolve();
        };

        setTimeout(checkPause, ms);

    });

}


/* ================= BUBBLE SORT ================= */

async function bubbleSort() {

    const n = array.length;

    for (let i = 0; i < n - 1; i++) {

        for (let j = 0; j < n - i - 1; j++) {

            if (stopRequested) return;

            comparisons++;

            renderBars([j, j + 1]);
            updateStats();

            await sleep(getDelay());

            if (array[j] > array[j + 1]) {

                [array[j], array[j + 1]] =
                    [array[j + 1], array[j]];

                swaps++;

                renderBars([], [j, j + 1]);
                updateStats();

                await sleep(getDelay());
            }
        }

        renderBars([], [], [n - i - 1]);
    }

    renderBars([], [], [...Array(n).keys()]);
}


/* ================= SELECTION SORT ================= */

async function selectionSort() {

    const n = array.length;

    for (let i = 0; i < n; i++) {

        let min = i;

        for (let j = i + 1; j < n; j++) {

            if (stopRequested) return;

            comparisons++;

            renderBars([min, j], [], [...Array(i).keys()]);
            updateStats();

            await sleep(getDelay());

            if (array[j] < array[min]) {
                min = j;
            }
        }

        if (min !== i) {

            [array[i], array[min]] =
                [array[min], array[i]];

            swaps++;

            renderBars([], [i, min], [...Array(i).keys()]);
            updateStats();

            await sleep(getDelay());
        }
    }

    renderBars([], [], [...Array(n).keys()]);
}


/* ================= INSERTION SORT ================= */

async function insertionSort() {

    const n = array.length;

    for (let i = 1; i < n; i++) {

        let key = array[i];
        let j = i - 1;

        while (j >= 0 && array[j] > key) {

            if (stopRequested) return;

            comparisons++;

            array[j + 1] = array[j];

            swaps++;

            renderBars([j, j + 1], [j + 1]);
            updateStats();

            await sleep(getDelay());

            j--;
        }

        array[j + 1] = key;

        renderBars([], [], [...Array(i + 1).keys()]);

        await sleep(getDelay());
    }

    renderBars([], [], [...Array(n).keys()]);
}


/* ================= MERGE SORT ================= */

async function mergeSort(start = 0, end = array.length - 1) {

    if (start >= end || stopRequested) return;

    const mid = Math.floor((start + end) / 2);

    await mergeSort(start, mid);

    await mergeSort(mid + 1, end);

    await merge(start, mid, end);
}


async function merge(start, mid, end) {

    let left = array.slice(start, mid + 1);
    let right = array.slice(mid + 1, end + 1);

    let i = 0;
    let j = 0;
    let k = start;

    while (i < left.length && j < right.length) {

        comparisons++;

        if (left[i] <= right[j]) {
            array[k] = left[i];
            i++;
        } else {
            array[k] = right[j];
            j++;
        }

        swaps++;

        renderBars([], [k]);
        updateStats();

        await sleep(getDelay());

        k++;
    }

    while (i < left.length) {

        array[k] = left[i++];

        swaps++;

        renderBars([], [k]);
        updateStats();

        await sleep(getDelay());

        k++;
    }

    while (j < right.length) {

        array[k] = right[j++];

        swaps++;

        renderBars([], [k]);
        updateStats();

        await sleep(getDelay());

        k++;
    }
}


/* ================= QUICK SORT ================= */

async function quickSort(low = 0, high = array.length - 1) {

    if (low >= high || stopRequested) return;

    const pivotIndex = await partition(low, high);

    await quickSort(low, pivotIndex - 1);

    await quickSort(pivotIndex + 1, high);
}


async function partition(low, high) {

    const pivot = array[high];

    let i = low;

    for (let j = low; j < high; j++) {

        comparisons++;

        renderBars([j, high]);
        updateStats();

        await sleep(getDelay());

        if (array[j] < pivot) {

            [array[i], array[j]] =
                [array[j], array[i]];

            swaps++;

            renderBars([], [i, j]);
            updateStats();

            await sleep(getDelay());

            i++;
        }
    }

    [array[i], array[high]] =
        [array[high], array[i]];

    swaps++;

    renderBars([], [i, high]);
    updateStats();

    await sleep(getDelay());

    return i;
}


/* ================= HEAP SORT ================= */

async function heapSort() {

    const n = array.length;

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(n, i);
    }

    for (let i = n - 1; i > 0; i--) {

        [array[0], array[i]] =
            [array[i], array[0]];

        swaps++;

        renderBars([], [0, i], [...Array(n - i - 1).keys()].map(x => n - x - 1));

        updateStats();

        await sleep(getDelay());

        await heapify(i, 0);
    }

    renderBars([], [], [...Array(n).keys()]);
}


async function heapify(n, i) {

    let largest = i;

    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n) {

        comparisons++;

        if (array[left] > array[largest]) {
            largest = left;
        }
    }

    if (right < n) {

        comparisons++;

        if (array[right] > array[largest]) {
            largest = right;
        }
    }

    if (largest !== i) {

        [array[i], array[largest]] =
            [array[largest], array[i]];

        swaps++;

        renderBars([], [i, largest]);
        updateStats();

        await sleep(getDelay());

        await heapify(n, largest);
    }
}


/* ================= SHELL SORT ================= */

async function shellSort() {

    const n = array.length;

    for (
        let gap = Math.floor(n / 2);
        gap > 0;
        gap = Math.floor(gap / 2)
    ) {

        for (let i = gap; i < n; i++) {

            const temp = array[i];

            let j = i;

            while (
                j >= gap &&
                array[j - gap] > temp
            ) {

                comparisons++;

                array[j] = array[j - gap];

                swaps++;

                renderBars([j - gap, j], [j]);
                updateStats();

                await sleep(getDelay());

                j -= gap;
            }

            array[j] = temp;
        }
    }

    renderBars([], [], [...Array(n).keys()]);
}


/* ================= COUNTING SORT ================= */

async function countingSort() {

    const max = Math.max(...array);

    const count = new Array(max + 1).fill(0);

    for (const value of array) {

        count[value]++;
    }

    let index = 0;

    for (let value = 0; value < count.length; value++) {

        while (count[value] > 0) {

            array[index] = value;

            swaps++;

            renderBars([], [index]);
            updateStats();

            await sleep(getDelay());

            index++;

            count[value]--;
        }
    }

    renderBars([], [], [...Array(array.length).keys()]);
}


/* ================= RADIX SORT ================= */

async function radixSort() {

    const max = Math.max(...array);

    for (
        let exp = 1;
        Math.floor(max / exp) > 0;
        exp *= 10
    ) {

        const output = new Array(array.length);
        const count = new Array(10).fill(0);

        for (const value of array) {

            count[Math.floor(value / exp) % 10]++;
        }

        for (let i = 1; i < 10; i++) {

            count[i] += count[i - 1];
        }

        for (let i = array.length - 1; i >= 0; i--) {

            const digit =
                Math.floor(array[i] / exp) % 10;

            output[count[digit] - 1] = array[i];

            count[digit]--;
        }

        for (let i = 0; i < array.length; i++) {

            array[i] = output[i];

            swaps++;

            renderBars([], [i]);
            updateStats();

            await sleep(getDelay());
        }
    }

    renderBars([], [], [...Array(array.length).keys()]);
}


/* ================= START SORT ================= */

async function startSorting() {

    if (isSorting) return;

    isSorting = true;
    isPaused = false;
    stopRequested = false;

    comparisons = 0;
    swaps = 0;

    updateStats();

    setStatus("Sorting...");

    startTime = performance.now();

    const selected = algorithmSelect.value;

    if (selected === "bubble") {
        await bubbleSort();
    }

    else if (selected === "selection") {
        await selectionSort();
    }

    else if (selected === "insertion") {
        await insertionSort();
    }

    else if (selected === "merge") {
        await mergeSort();
    }

    else if (selected === "quick") {
        await quickSort();
    }

    else if (selected === "heap") {
        await heapSort();
    }

    else if (selected === "shell") {
        await shellSort();
    }

    else if (selected === "counting") {
        await countingSort();
    }

    else if (selected === "radix") {
        await radixSort();
    }

    if (!stopRequested) {

        const elapsed =
            (performance.now() - startTime) / 1000;

        timeEl.textContent =
            `${elapsed.toFixed(2)}s`;

        renderBars([], [], [...Array(array.length).keys()]);

        setStatus("Sorted");
    }

    isSorting = false;
}


/* ================= PAUSE ================= */

pauseBtn.addEventListener("click", () => {

    if (!isSorting) return;

    isPaused = !isPaused;

    pauseBtn.textContent =
        isPaused ? "▶ Resume" : "❚❚ Pause";

    setStatus(
        isPaused ? "Paused" : "Sorting..."
    );

});


/* ================= RESET ================= */

resetBtn.addEventListener("click", () => {

    stopRequested = true;

    isSorting = false;
    isPaused = false;

    pauseBtn.textContent = "❚❚ Pause";

    generateArray();

    timeEl.textContent = "0.00s";

    setStatus("Ready");

});


/* ================= GENERATE ================= */

generateBtn.addEventListener("click", () => {

    stopRequested = true;

    isSorting = false;

    generateArray();

});


/* ================= START ================= */

startBtn.addEventListener("click", () => {

    startSorting();

});


/* ================= ALGORITHM CHANGE ================= */

algorithmSelect.addEventListener("change", () => {

    updateAlgorithmInfo();

});


/* ================= CUSTOM ARRAY ================= */

setArrayBtn.addEventListener("click", () => {

    const values = customInput.value
        .split(",")
        .map(Number)
        .filter(value => Number.isFinite(value));

    if (values.length === 0) {

        alert("Please enter valid numbers.");

        return;
    }

    array = values.map(value =>
        Math.max(5, Math.min(100, value))
    );

    comparisons = 0;
    swaps = 0;

    updateStats();

    renderBars();

    setStatus("Ready");

});


/* ================= RANDOM ================= */

randomBtn.addEventListener("click", () => {

    generateArray();

});


/* ================= SORTED ================= */

sortedBtn.addEventListener("click", () => {

    array.sort((a, b) => a - b);

    renderBars();

    setStatus("Ready");

});


/* ================= REVERSE ================= */

reverseBtn.addEventListener("click", () => {

    array.sort((a, b) => b - a);

    renderBars();

    setStatus("Ready");

});


/* ================= NEARLY SORTED ================= */

nearlyBtn.addEventListener("click", () => {

    array.sort((a, b) => a - b);

    for (let i = 0; i < 3 && array.length > 5; i++) {

        const a =
            Math.floor(Math.random() * array.length);

        const b =
            Math.floor(Math.random() * array.length);

        [array[a], array[b]] =
            [array[b], array[a]];
    }

    renderBars();

    setStatus("Ready");

});


/* ================= INITIALIZE ================= */

updateAlgorithmInfo();
generateArray();