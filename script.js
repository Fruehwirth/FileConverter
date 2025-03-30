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
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp', 'image/svg+xml', 'image/x-icon'];
    if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPG, PNG, WebP, BMP, SVG, or ICO).');
        return;
    }

    currentFile = file;
    previewFile(file);
    
    // Get the current file type
    const currentType = file.type === 'image/svg+xml' ? 'svg' : 
                       file.type === 'image/x-icon' ? 'ico' : 
                       file.type.split('/')[1];
    
    // Filter out the current file type from options
    const options = formatSelect.options;
    for (let i = 0; i < options.length; i++) {
        if (options[i].value === currentType) {
            options[i].style.display = 'none';
        } else {
            options[i].style.display = '';
        }
    }
    
    // Reset the selection
    formatSelect.value = '';
    
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
            let mimeType;
            if (formatSelect.value === 'ico') {
                // For ICO files, we'll create a 32x32 version
                const icoCanvas = document.createElement('canvas');
                icoCanvas.width = 32;
                icoCanvas.height = 32;
                const icoCtx = icoCanvas.getContext('2d');
                icoCtx.drawImage(img, 0, 0, 32, 32);
                canvas = icoCanvas;
                mimeType = 'image/x-icon';
            } else if (formatSelect.value === 'svg') {
                // For SVG conversion, we'll create a simple SVG representation
                const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${img.width}" height="${img.height}">
                    <image href="${e.target.result}" width="${img.width}" height="${img.height}"/>
                </svg>`;
                const blob = new Blob([svgString], { type: 'image/svg+xml' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                const originalName = currentFile.name;
                const newName = originalName.replace(/\.[^/.]+$/, '') + '.svg';
                a.download = newName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                return;
            } else {
                mimeType = `image/${formatSelect.value}`;
            }

            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
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