
// Avatar preview
document
  .getElementById("avatar")
  .addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById("avatarPreview").src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

// Cover image preview
document
  .getElementById("coverImage")
  .addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById("coverPreview").src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

// Bio character counter
document.getElementById("bio").addEventListener("input", function (e) {
  const maxLength = 250;
  const currentLength = e.target.value.length;
  const counter = document.getElementById("bioCounter");

  counter.textContent = currentLength;

  if (currentLength > maxLength) {
    e.target.value = e.target.value.substring(0, maxLength);
    counter.textContent = maxLength;
  }
});

// Example district population logic (would typically fetch from a database or API)
document.getElementById("state").addEventListener("change", function (e) {
  const state = e.target.value;
  const districtDropdown = document.getElementById("district");

  // Clear existing options
  districtDropdown.innerHTML =
    '<option value="" disabled selected>Select your district</option>';

  // Sample district data - in a real app, this would be fetched from a server
  const districts = {
    "West Bengal": [
      "Kolkata",
      "Howrah",
      "North 24 Parganas",
      "South 24 Parganas",
      "East Midnapore",
    ],
    Maharashtra: ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik"],
    // Add more states and their districts
  };

  // Populate districts if we have data for the selected state
  if (districts[state]) {
    districts[state].forEach((district) => {
      const option = document.createElement("option");
      option.value = district;
      option.textContent = district;
      districtDropdown.appendChild(option);
    });
  }
})