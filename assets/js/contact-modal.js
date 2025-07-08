// Initialize EmailJS
emailjs.init("YOUR_USER_ID"); // 🔧 Replace with your EmailJS user ID

document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("contactModal");
  const openBtn = document.getElementById("openModal");
  const closeBtn = document.querySelector(".close-button");
  const form = document.getElementById("contactForm");
  const messageBox = document.getElementById("formMessage");

  // Open modal
  openBtn.addEventListener("click", function (e) {
    e.preventDefault();
    modal.style.display = "block";
  });

  // Close modal
  closeBtn.addEventListener("click", function () {
    modal.style.display = "none";
    form.reset();
    messageBox.innerHTML = "";
  });

  // Click outside modal to close
  window.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.style.display = "none";
      form.reset();
      messageBox.innerHTML = "";
    }
  });

  // Form submission
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const params = {
      name: form.name.value,
      mobile: form.mobile.value,
      segment: form.segment.value,
      remarks: form.remarks.value
    };

    // 🔧 Replace with your actual EmailJS service and template IDs
    emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", params)
      .then(() => {
        messageBox.innerHTML = `<p style="color: green;">✅ Request submitted successfully!</p>`;
        form.reset();
      })
      .catch(() => {
        messageBox.innerHTML = `<p style="color: red;">❌ Failed to send. Please try again.</p>`;
      });
  });
});
