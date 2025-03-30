// DOM Elements
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const formatSelect = document.getElementById('formatSelect');
const convertBtn = document.getElementById('convertBtn');
const filePreview = document.getElementById('filePreview');
const closeButton = document.getElementById('closeButton');

// State
let currentFile = null;

// Event Listeners
dropZone.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('dragover', handleDragOver);
dropZone.addEventListener('dragleave', handleDragLeave);
dropZone.addEventListener('drop', handleDrop);
fileInput.addEventListener('change', handleFileSelect);
formatSelect.addEventListener('change', handleFormatSelect);
convertBtn.addEventListener('click', handleConversion);
closeButton.addEventListener('click', handleClose);

// Drag and Drop Handlers
function handleDragOver(e) {
    e.preventDefault();
    dropZone.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    dropZone.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
}

// File Selection Handler
function handleFileSelect(e) {
    const files = e.target.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
}

// Format Selection Handler
function handleFormatSelect() {
    updateConvertButton();
}

// File Handler
function handleFile(file) {
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
    }

    currentFile = file;
    previewFile(file);
    updateConvertButton();
    updateDropZoneUI();
}

// Preview Handler
function previewFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        filePreview.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Close Handler
function handleClose(e) {
    e.preventDefault();
    e.stopPropagation();
    currentFile = null;
    fileInput.value = '';
    filePreview.src = '';
    updateConvertButton();
    updateDropZoneUI();
}

// Conversion Handler
function handleConversion() {
    if (!currentFile || !formatSelect.value) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            // Convert to selected format
            const mimeType = `image/${formatSelect.value}`;
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                // Preserve original filename but change extension
                const originalName = currentFile.name;
                const newName = originalName.replace(/\.[^/.]+$/, '') + '.' + formatSelect.value;
                a.download = newName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, mimeType);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(currentFile);
}

// UI Update Functions
function updateDropZoneUI() {
    if (currentFile) {
        dropZone.classList.add('has-file');
        closeButton.style.display = 'flex';
    } else {
        dropZone.classList.remove('has-file');
        closeButton.style.display = 'none';
    }
}

function updateConvertButton() {
    convertBtn.disabled = !currentFile || !formatSelect.value;
}

// Initialize
function init() {
    // Add any initialization code here
}

// Start the application
init(); 