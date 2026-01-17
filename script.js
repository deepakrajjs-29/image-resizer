// Create stars
const starsContainer = document.getElementById('stars');
for (let i = 0; i < 200; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.animationDelay = Math.random() * 3 + 's';
    starsContainer.appendChild(star);
}

// Create shooting stars
function createShootingStar() {
    const star = document.createElement('div');
    star.className = 'shooting-star';
    star.style.top = Math.random() * 50 + '%';
    star.style.right = Math.random() * 100 + '%';
    star.style.animationDelay = Math.random() * 3 + 's';
    document.querySelector('.animated-background').appendChild(star);
    
    setTimeout(() => star.remove(), 3000);
}

setInterval(createShootingStar, 2000);

// Create floating particles
for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 15 + 's';
    document.querySelector('.animated-background').appendChild(particle);
}

// Image resizer functionality
let originalImage = null;
let originalWidth = 0;
let originalHeight = 0;
let resizedDataUrl = null;

const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const previewSection = document.getElementById('previewSection');
const previewImg = document.getElementById('previewImg');

uploadArea.addEventListener('click', () => fileInput.click());

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragging');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragging');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragging');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleImage(file);
    }
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleImage(file);
    }
});

function handleImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        originalImage = new Image();
        originalImage.onload = () => {
            originalWidth = originalImage.width;
            originalHeight = originalImage.height;
            
            previewImg.src = e.target.result;
            document.getElementById('origWidth').textContent = originalWidth + 'px';
            document.getElementById('origHeight').textContent = originalHeight + 'px';
            document.getElementById('fileSize').textContent = formatFileSize(file.size);
            
            document.getElementById('widthInput').value = originalWidth;
            document.getElementById('heightInput').value = originalHeight;
            document.getElementById('scaleInput').value = 100;
            
            previewSection.classList.add('active');
            document.getElementById('resultSection').style.display = 'none';
        };
        originalImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

document.getElementById('widthInput').addEventListener('input', function() {
    if (document.getElementById('maintainAspect').checked && originalWidth > 0) {
        const ratio = originalHeight / originalWidth;
        document.getElementById('heightInput').value = Math.round(this.value * ratio);
    }
    updateScaleFromDimensions();
});

document.getElementById('heightInput').addEventListener('input', function() {
    if (document.getElementById('maintainAspect').checked && originalHeight > 0) {
        const ratio = originalWidth / originalHeight;
        document.getElementById('widthInput').value = Math.round(this.value * ratio);
    }
    updateScaleFromDimensions();
});

document.getElementById('scaleInput').addEventListener('input', function() {
    if (originalWidth > 0 && originalHeight > 0) {
        const scale = this.value / 100;
        document.getElementById('widthInput').value = Math.round(originalWidth * scale);
        document.getElementById('heightInput').value = Math.round(originalHeight * scale);
    }
});

function updateScaleFromDimensions() {
    const width = document.getElementById('widthInput').value;
    if (originalWidth > 0 && width > 0) {
        const scale = (width / originalWidth) * 100;
        document.getElementById('scaleInput').value = Math.round(scale);
    }
}

function resizeImage() {
    if (!originalImage) return;

    const newWidth = parseInt(document.getElementById('widthInput').value);
    const newHeight = parseInt(document.getElementById('heightInput').value);
    const quality = parseFloat(document.getElementById('qualitySelect').value);

    if (!newWidth || !newHeight) {
        alert('Please enter valid dimensions');
        return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = newWidth;
    canvas.height = newHeight;
    const ctx = canvas.getContext('2d');
    
    ctx.drawImage(originalImage, 0, 0, newWidth, newHeight);
    
    resizedDataUrl = canvas.toDataURL('image/jpeg', quality);
    
    document.getElementById('resultImg').src = resizedDataUrl;
    document.getElementById('newWidth').textContent = newWidth + 'px';
    document.getElementById('newHeight').textContent = newHeight + 'px';
    
    const base64Length = resizedDataUrl.length - (resizedDataUrl.indexOf(',') + 1);
    const estimatedSize = (base64Length * 3) / 4;
    document.getElementById('newSize').textContent = formatFileSize(estimatedSize);
    
    document.getElementById('resultSection').style.display = 'block';
    
    document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function downloadImage() {
    if (!resizedDataUrl) return;

    const link = document.createElement('a');
    link.download = 'resized-image.jpg';
    link.href = resizedDataUrl;
    link.click();
}

function reset() {
    originalImage = null;
    originalWidth = 0;
    originalHeight = 0;
    resizedDataUrl = null;
    
    previewSection.classList.remove('active');
    document.getElementById('resultSection').style.display = 'none';
    fileInput.value = '';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
