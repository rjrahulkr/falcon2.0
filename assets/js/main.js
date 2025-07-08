// Falcon Futures Main JavaScript
const $ = window.jQuery;
const Swiper = window.Swiper;
const bootstrap = window.bootstrap;

$(document).ready(() => {
  /** -------------------
   * 🔹 Preloader
   * ------------------- */
   // Inject loader HTML into body
    // Inject loader with rotating logo
  // $("body").prepend(`
  //   <div id="loader">
  //     <div class="loader-ring">
  //       <img src="assets/image/logo.png" alt="Falcon Futures Logo" class="loader-logo" id="logo-imgs"/>
  //     </div>
  //     <div class="loading-text">Loading<span class="dots"></span></div>
  //   </div>
  // `);
 
  // // Hide loader after everything loads
  // $(window).on("load", function () {
  //   $("#loader").fadeOut("slow", function () {
  //     $(this).remove();
  //   });
  // });


  //-------------logo------------
  
                const logoImg = document.getElementById("logo-imgs");

                

                fetch("../assets/image/logo.png", { method: "HEAD" })
                    .then(response => {
                        logoImg.src = response.ok ? "../assets/image/logo.png" : "../../assets/image/logo.png";
                    })
                    .catch(() => {
                        logoImg.src = "../../assets/image/logo.png";
                    });
  /** -------------------
   * 🔹 Navbar Scroll Effect
   * ------------------- */
  $(window).scroll(function () {
    if ($(this).scrollTop() > 50) {
      $(".falcon-navbar").addClass("scrolled");
    } else {
      $(".falcon-navbar").removeClass("scrolled");
    }

    // Back to top button toggle
    if ($(this).scrollTop() > 300) {
      $(".falcon-back-to-top").fadeIn();
    } else {
      $(".falcon-back-to-top").fadeOut();
    }
  });

  /** -------------------
   * 🔹 Smooth Scrolling
   * ------------------- */
  $('a[href^="#"]').on("click", function (e) {
    const target = $(this.getAttribute("href"));
    if (target.length) {
      e.preventDefault();
      $("html, body").animate(
        {
          scrollTop: target.offset().top - 80,
        },
        1000
      );
    }
  });

  /** -------------------
   * 🔹 Stock Ticker Animation
   * ------------------- */
  function animateStockTicker() {
    $(".falcon-ticker-content").animate(
      { marginLeft: "-100%" },
      20000,
      "linear",
      function () {
        $(this).css("margin-left", "100%");
        animateStockTicker();
      }
    );
  }
  animateStockTicker();

  /** -------------------
   * 🔹 Hover Effects
   * ------------------- */
  $(".falcon-service-card").hover(
    function () {
      $(this)
        .find(".falcon-service-icon")
        .addClass("animate__animated animate__pulse");
    },
    function () {
      $(this)
        .find(".falcon-service-icon")
        .removeClass("animate__animated animate__pulse");
    }
  );

  $(".falcon-play-button").click(function () {
    $(this).addClass("animate__animated animate__bounceIn");
    setTimeout(() => {
      $(this).removeClass("animate__animated animate__bounceIn");
    }, 1000);
  });

  /** -------------------
   * 🔹 Animated Counters
   * ------------------- */
  function animateCounters() {
    $(".falcon-counter").each(function () {
      const $this = $(this);
      const countTo = $this.attr("data-count");
      $({ countNum: $this.text() }).animate(
        {
          countNum: countTo,
        },
        {
          duration: 2000,
          easing: "linear",
          step: function () {
            $this.text(Math.floor(this.countNum));
          },
          complete: function () {
            $this.text(this.countNum);
          },
        }
      );
    });
  }

  /** -------------------
   * 🔹 Intersection Observer
   * ------------------- */
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
      }
    });
  }, observerOptions);

  document
    .querySelectorAll(".falcon-service-card, .falcon-testimonial-card")
    .forEach((el) => observer.observe(el));

  /** -------------------
   * 🔹 Form Validation (Reusable)
   * ------------------- */
  function validateForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const inputs = form.querySelectorAll(
          "input[required], textarea[required]"
        );
        let isValid = true;

        inputs.forEach((input) => {
          if (!input.value.trim()) {
            isValid = false;
            input.classList.add("is-invalid");
          } else {
            input.classList.remove("is-invalid");
          }
        });

        if (isValid) {
          console.log("Form is valid, submitting...");
          form.submit(); // Or use AJAX
        }
      });
    }
  }

  /** -------------------
   * 🔹 Bootstrap Tooltips & Popovers
   * ------------------- */
  const tooltipList = [].slice
    .call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    .map((el) => new bootstrap.Tooltip(el));

  const popoverList = [].slice
    .call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    .map((el) => new bootstrap.Popover(el));

  /** -------------------
   * 🔹 Mobile Nav Auto Close
   * ------------------- */
  $(".navbar-nav .nav-link").on("click", () => {
    if (window.innerWidth < 992) {
      $(".navbar-collapse").collapse("hide");
    }
  });

  /** -------------------
   * 🔹 Back to Top Button
   * ------------------- */
  $(".falcon-back-to-top").click(() => {
    $("html, body").animate({ scrollTop: 0 }, 800);
    return false;
  });
});

/** -------------------
 * ✅ Notification Utility
 * ------------------- */
function showNotification(message, type = "success") {
  const notification = $(`
    <div class="alert alert-${type} alert-dismissible fade show falcon-notification" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `);
  $("body").append(notification);
  setTimeout(() => {
    notification.alert("close");
  }, 5000);
}

/** -------------------
 * ✅ API Helper
 * ------------------- */
async function makeAPICall(url, method = "GET", data = null) {
  try {
    const options = {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };
    if (data) {
      options.body = JSON.stringify(data);
    }
    const response = await fetch(url, options);
    return await response.json();
  } catch (error) {
    console.error("API call failed:", error);
    showNotification("An error occurred. Please try again.", "danger");
  }
}







