// Get the TPA and Insurance buttons
const tpaButton = document.getElementById('tpaButton');
const insuranceButton = document.getElementById('insuranceButton');

// Get the forms
const tpaForm = document.getElementById('tpaForm');
const insuranceCompanyForm = document.getElementById('insuranceCompanyForm');

// Set up event listeners for the buttons
tpaButton.addEventListener('click', function () {
  // Show TPA form and hide Insurance form
  tpaForm.classList.add('active');
  tpaForm.classList.remove('d-none');
  insuranceCompanyForm.classList.add('d-none');
  insuranceCompanyForm.classList.remove('active');
});

insuranceButton.addEventListener('click', function () {
  // Show Insurance form and hide TPA form
  insuranceCompanyForm.classList.add('active');
  insuranceCompanyForm.classList.remove('d-none');
  tpaForm.classList.add('d-none');
  tpaForm.classList.remove('active');
});



// Get references to buttons
const tpaLoginBtn = document.getElementById("tpa-login");
const insuranceLoginBtn = document.getElementById("insurance-com-login");
const hospitalLoginBtn = document.getElementById("hospital-login"); // Make sure this button exists

// Event listener for TPA button click
tpaLoginBtn.addEventListener("click", function () {
  // Change the button color to indicate selection
  tpaLoginBtn.classList.add("btn-success");
  insuranceLoginBtn.classList.remove("btn-success");
  hospitalLoginBtn.classList.remove("btn-success");
});

// Event listener for Insurance Company button click
insuranceLoginBtn.addEventListener("click", function () {
  insuranceLoginBtn.classList.add("btn-success");
  tpaLoginBtn.classList.remove("btn-success");
  hospitalLoginBtn.classList.remove("btn-success");
});

// Event listener for Hospital button click (add this if needed)
hospitalLoginBtn.addEventListener("click", function () {
  hospitalLoginBtn.classList.add("btn-success");
  tpaLoginBtn.classList.remove("btn-success");
  insuranceLoginBtn.classList.remove("btn-success");
});




