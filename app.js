// Character counter for description
const descriptionField = document.getElementById('description');
const charCount = document.getElementById('charCount');

descriptionField.addEventListener('input', function () {
  const length = this.value.length;
  charCount.textContent = Math.min(length, 500);
  if (length > 500) {
    this.value = this.value.substring(0, 500);
  }
});

// Stock indicator
const stockInput = document.getElementById('stock');
const stockIndicator = document.getElementById('stockIndicator');
const stockStatus = document.getElementById('stockStatus');

stockInput.addEventListener('input', function () {
  const value = parseInt(this.value) || 0;

  stockIndicator.classList.remove('in-stock', 'low-stock', 'out-of-stock');

  if (value === 0) {
    stockIndicator.classList.add('out-of-stock');
    stockStatus.textContent = 'Out of Stock';
  } else if (value < 10) {
    stockIndicator.classList.add('low-stock');
    stockStatus.textContent = 'Low Stock';
  } else {
    stockIndicator.classList.add('in-stock');
    stockStatus.textContent = 'In Stock';
  }
});

// Image upload with drag and drop
const imageUpload = document.getElementById('imageUpload');
const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');
const previewImg = document.getElementById('previewImg');

imageUpload.addEventListener('dragover', (e) => {
  e.preventDefault();
  imageUpload.classList.add('drag-over');
});

imageUpload.addEventListener('dragleave', () => {
  imageUpload.classList.remove('drag-over');
});

imageUpload.addEventListener('drop', (e) => {
  e.preventDefault();
  imageUpload.classList.remove('drag-over');

  const files = e.dataTransfer.files;
  if (files.length > 0) {
    // Update the file input with the dropped file
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(files[0]);
    imageInput.files = dataTransfer.files;
    handleImageFile(files[0]);
  }
});

imageInput.addEventListener('change', function () {
  if (this.files && this.files[0]) {
    handleImageFile(this.files[0]);
  }
});

function handleImageFile(file) {
  if (file.type.startsWith('image/')) {
    const reader = new FileReader();

    reader.onload = function (e) {
      previewImg.src = e.target.result;
      imagePreview.classList.add('active');
    };
    reader.readAsDataURL(file);
  }
}

// Form submission
const productForm = document.getElementById('productForm');
const successMessage = document.getElementById('successMessage');

productForm.addEventListener('submit', function (e) {
  e.preventDefault();

  // Get form data
  const formData = new FormData(this);

  // Get selected categories
  const categories = [];
  document
    .querySelectorAll('input[name="categories"]:checked')
    .forEach((checkbox) => {
      categories.push(checkbox.value);
    });

  // Validate at least one category is selected
  if (categories.length === 0) {
    alert('Please select at least one category');
    return;
  }

  // Create product object
  const product = {
    name: formData.get('productName'),
    description: formData.get('description'),
    stock: parseInt(formData.get('stock')),
    price: parseFloat(formData.get('price')),
    categories: categories,
    image: imageInput.files[0],
  };

  // Log the product data (in real app, this would be sent to server)
  // Send to server
  fetch('http://localhost:3000/api/products', {
    method: 'POST',
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Success:', data);
      successMessage.classList.add('active');
      setTimeout(() => {
        successMessage.classList.remove('active');
        productForm.reset();
      }, 3000);
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('Error creating product');
    });
});

// Reset form
const resetBtn = document.getElementById('resetBtn');
resetBtn.addEventListener('click', function () {
  if (confirm('Are you sure you want to reset the form?')) {
    productForm.reset();
    imagePreview.classList.remove('active');
    charCount.textContent = '0';
    stockIndicator.classList.remove('in-stock', 'low-stock');
    stockIndicator.classList.add('out-of-stock');
    stockStatus.textContent = 'Out of Stock';
  }
});
