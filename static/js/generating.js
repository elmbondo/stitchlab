const messages = [
    "Counting stitches...",
    "Reading your image...",
    "Calculating measurements...",
    "Crafting your pattern...",
    "Almost ready..."
];

let index = 0;
const statusText = document.getElementById('statusText');

function cycleMessages() {
    statusText.style.opacity = '0';
    setTimeout(() => {
        index = (index + 1) % messages.length;
        statusText.textContent = messages[index];
        statusText.style.opacity = '1';
    }, 500);
}

setInterval(cycleMessages, 2500);

// Simulate generation then redirect to results
// This will be replaced with actual API call later
setTimeout(() => {
    window.location.href = '/results';
}, 12000);