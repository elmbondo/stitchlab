let currentUnit = 'inches';
let selectedColors = ['Dusty Rose', 'Teal'];

// Get garment and stitch from previous screen
const garment = sessionStorage.getItem('garment') || 'dress';
const stitch = sessionStorage.getItem('stitch') || 'Double Crochet';

// Set garment preview
document.getElementById('previewGarment').textContent =
    garment.charAt(0).toUpperCase() + garment.slice(1);

const garmentEmojis = {
    dress: '👗', trousers: '👖', shorts: '🩳',
    skirt: '👗', top: '👕', sweater: '🧥',
    cardigan: '🧥', scarf: '🧣'
};
document.getElementById('garmentIcon').textContent =
    garmentEmojis[garment] || '👗';

// Unit toggle
function setUnit(unit) {
    currentUnit = unit;
    const label = unit === 'inches' ? 'in' : 'cm';
    document.querySelectorAll('.unit-label').forEach(el => el.textContent = label);
    document.getElementById('inchesBtn').classList.toggle('active', unit === 'inches');
    document.getElementById('cmBtn').classList.toggle('active', unit === 'cm');
}

// Color selection
function toggleColor(el) {
    const color = el.dataset.color;
    if (el.classList.contains('selected')) {
        el.classList.remove('selected');
        el.querySelector('.check')?.remove();
        selectedColors = selectedColors.filter(c => c !== color);
    } else {
        if (selectedColors.length >= 3) {
            alert('You can select up to 3 colors only.');
            return;
        }
        el.classList.add('selected');
        const check = document.createElement('span');
        check.className = 'check';
        check.textContent = '✓';
        el.appendChild(check);
        selectedColors.push(color);
    }
    updateSelectedDisplay();
}

function updateSelectedDisplay() {
    const container = document.getElementById('selectedColors');
    const swatches = document.querySelectorAll('.color-swatch');
    container.innerHTML = '<span class="selected-label">Selected:</span>';
    selectedColors.forEach(colorName => {
        swatches.forEach(swatch => {
            if (swatch.dataset.color === colorName) {
                const tag = document.createElement('span');
                tag.className = 'color-tag';
                const dot = document.createElement('span');
                dot.style.cssText = `width:12px;height:12px;border-radius:50%;background:${swatch.style.background};display:inline-block;border:1px solid rgba(0,0,0,0.1)`;
                tag.appendChild(dot);
                tag.appendChild(document.createTextNode(colorName));
                container.appendChild(tag);
            }
        });
    });
}

// Live preview updates
document.getElementById('yarnType').addEventListener('change', function() {
    document.getElementById('previewYarn').textContent = this.value;
});

document.getElementById('yarnSize').addEventListener('change', function() {
    document.getElementById('previewSize').textContent = this.value;
});

document.getElementById('hookSize').addEventListener('change', function() {
    document.getElementById('previewHook').textContent = this.value;
});

// Validation
function validateFields() {
    const fields = ['bust', 'waist', 'hips', 'length'];
    let valid = true;
    fields.forEach(id => {
        const input = document.getElementById(id);
        const wrapper = input.parentElement;
        if (!input.value || parseFloat(input.value) <= 0) {
            wrapper.classList.add('error');
            valid = false;
        } else {
            wrapper.classList.remove('error');
        }
    });
    return valid;
}

// Generate pattern
function generatePattern() {
    if (!validateFields()) {
        alert('Please fill in all required measurements.');
        return;
    }

    const data = {
        garment,
        stitch,
        unit: currentUnit,
        bust: document.getElementById('bust').value,
        waist: document.getElementById('waist').value,
        hips: document.getElementById('hips').value,
        length: document.getElementById('length').value,
        shoulder: document.getElementById('shoulder').value,
        sleeve: document.getElementById('sleeve').value,
        colors: selectedColors,
        yarnType: document.getElementById('yarnType').value,
        yarnSize: document.getElementById('yarnSize').value,
        hookSize: document.getElementById('hookSize').value,
    };

    sessionStorage.setItem('patternData', JSON.stringify(data));
    window.location.href = '/generating';
}

// Save draft
function saveDraft() {
    alert('Draft saved!');
}