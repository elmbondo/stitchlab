const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const analyseBtn = document.getElementById('analyseBtn');
const analysisEmpty = document.getElementById('analysisEmpty');
const analysisResult = document.getElementById('analysisResult');
const stitchName = document.getElementById('stitchName');
const confirmYes = document.getElementById('confirmYes');
const confirmNo = document.getElementById('confirmNo');
const commentBox = document.getElementById('commentBox');
const proceedBtn = document.getElementById('proceedBtn');
const pills = document.querySelectorAll('.pill');

let selectedGarment = 'dress';
let uploadedFile = null;

// Garment pill selection
pills.forEach(pill => {
    pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        selectedGarment = pill.dataset.type;
    });
});

// File input change
fileInput.addEventListener('change', (e) => {
    handleFile(e.target.files[0]);
});

// Drag and drop
dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.style.borderColor = 'var(--coral)';
});

dropzone.addEventListener('dragleave', () => {
    dropzone.style.borderColor = 'var(--teal)';
});

dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.style.borderColor = 'var(--teal)';
    handleFile(e.dataTransfer.files[0]);
});

function handleFile(file) {
    if (!file) return;
    uploadedFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
        preview.src = e.target.result;
        preview.classList.remove('hidden');
        analyseBtn.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
}

// Analyse button
analyseBtn.addEventListener('click', async () => {
    if (!uploadedFile) return;

    analyseBtn.textContent = 'Analysing...';
    analyseBtn.disabled = true;

    const formData = new FormData();
    formData.append('image', uploadedFile);
    formData.append('garment_type', selectedGarment);

    try {
        const response = await fetch('/analyse', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();

        stitchName.textContent = data.stitch;
        analysisEmpty.classList.add('hidden');
        analysisResult.classList.remove('hidden');

    } catch (error) {
        console.error('Error:', error);
        analyseBtn.textContent = 'Analyse Image';
        analyseBtn.disabled = false;
    }
});

// Confirm stitch
confirmYes.addEventListener('click', () => {
    proceedBtn.classList.remove('hidden');
    commentBox.classList.add('hidden');
});

confirmNo.addEventListener('click', () => {
    commentBox.classList.remove('hidden');
    proceedBtn.classList.remove('hidden');
});

// Proceed button
proceedBtn.addEventListener('click', () => {
    const stitch = commentBox.classList.contains('hidden')
        ? stitchName.textContent
        : document.getElementById('stitchInput').value || stitchName.textContent;

    sessionStorage.setItem('stitch', stitch);
    sessionStorage.setItem('garment', selectedGarment);
    window.location.href = '/measurements';
});