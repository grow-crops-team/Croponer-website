const coverImageInput = document.querySelector("#coverImage")
const avatarImageInput = document.querySelector("#avatar")
const userName = document.querySelector("#userName")
const profileUpdateForm = document.querySelector("#profileUpdateForm")
const fullName = document.querySelector("#fullName")
const email = document.querySelector("#email")
const userBio = document.querySelector("#bio")
// address
const country = document.querySelector("#country")
const state = document.querySelector("#state")
const district = document.querySelector("#district")
const village = document.querySelector("#village")
const pincode = document.querySelector("#pincode")
const streetAddress = document.querySelector("#streetAddress")

const cancelBtn = document.querySelector("#cancelBtn")

// Cover image preview
coverImageInput.addEventListener("change", function (e) {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = function (e) {
        document.getElementById("coverPreview").src = e.target.result
      }
      reader.readAsDataURL(file)
    }
  })

// Avatar preview
avatarImageInput.addEventListener("change", function (e) {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = function (e) {
        document.getElementById("avatarPreview").src = e.target.result
      }
      reader.readAsDataURL(file)
    }
  })

// Bio character counter
document.getElementById("bio").addEventListener("input", function (e) {
  const maxLength = 250
  const currentLength = e.target.value.length;
  const counter = document.getElementById("bioCounter")

  counter.textContent = currentLength;

  if (currentLength > maxLength) {
    e.target.value = e.target.value.substring(0, maxLength)
    counter.textContent = maxLength
  }
})

