// Investment Study Guide JavaScript
class StudyGuide {
  constructor() {
    this.currentPage = 1
    this.totalPages = 17
    this.init()
  }

  init() {
    this.bindEvents()
    this.updatePageDisplay()
    this.updateNavigationState()
  }

  bindEvents() {
    // Previous button
    document.getElementById("prevBtn").addEventListener("click", () => {
      this.goToPreviousPage()
    })

    // Next button
    document.getElementById("nextBtn").addEventListener("click", () => {
      this.goToNextPage()
    })

    // Page selector dropdown
    document.getElementById("pageSelect").addEventListener("change", (e) => {
      this.goToPage(Number.parseInt(e.target.value))
    })

    // Sidebar navigation
    document.querySelectorAll(".chapter-item").forEach((item) => {
      item.addEventListener("click", () => {
        const pageNumber = Number.parseInt(item.getAttribute("data-page"))
        this.goToPage(pageNumber)
      })
    })

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft" && this.currentPage > 1) {
        this.goToPreviousPage()
      } else if (e.key === "ArrowRight" && this.currentPage < this.totalPages) {
        this.goToNextPage()
      }
    })

    // Handle window resize for responsive behavior
    window.addEventListener("resize", () => {
      this.handleResize()
    })
  }

  goToPage(pageNumber) {
    if (pageNumber < 1 || pageNumber > this.totalPages) {
      return
    }

    // Hide current page
    const currentPageElement = document.getElementById(`page-${this.currentPage}`)
    if (currentPageElement) {
      currentPageElement.classList.remove("active")
    }

    // Update current page
    this.currentPage = pageNumber

    // Show new page
    const newPageElement = document.getElementById(`page-${this.currentPage}`)
    if (newPageElement) {
      newPageElement.classList.add("active")
    }

    // Update UI
    this.updatePageDisplay()
    this.updateNavigationState()
    this.updateSidebarActive()
    this.scrollToTop()

    // Save progress to localStorage
    this.saveProgress()
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1)
    }
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1)
    }
  }

  updatePageDisplay() {
    // Update page counter
    document.getElementById("currentPage").textContent = this.currentPage
    document.getElementById("totalPages").textContent = this.totalPages

    // Update page selector
    document.getElementById("pageSelect").value = this.currentPage
  }

  updateNavigationState() {
    const prevBtn = document.getElementById("prevBtn")
    const nextBtn = document.getElementById("nextBtn")

    // Enable/disable previous button
    prevBtn.disabled = this.currentPage === 1

    // Enable/disable next button
    nextBtn.disabled = this.currentPage === this.totalPages
  }

  updateSidebarActive() {
    // Remove active class from all sidebar items
    document.querySelectorAll(".chapter-item").forEach((item) => {
      item.classList.remove("active")
    })

    // Add active class to current page item
    const currentItem = document.querySelector(`[data-page="${this.currentPage}"]`)
    if (currentItem) {
      currentItem.classList.add("active")
    }
  }

  scrollToTop() {
    const contentWrapper = document.querySelector(".content-wrapper")
    if (contentWrapper) {
      contentWrapper.scrollTop = 0
    }
  }

  saveProgress() {
    localStorage.setItem(
      "investmentGuideProgress",
      JSON.stringify({
        currentPage: this.currentPage,
        timestamp: new Date().toISOString(),
      }),
    )
  }

  loadProgress() {
    const saved = localStorage.getItem("investmentGuideProgress")
    if (saved) {
      try {
        const progress = JSON.parse(saved)
        if (progress.currentPage && progress.currentPage <= this.totalPages) {
          this.goToPage(progress.currentPage)
        }
      } catch (e) {
        console.log("Could not load saved progress")
      }
    }
  }

  handleResize() {
    // Handle responsive behavior if needed
    const sidebar = document.querySelector(".navigation-sidebar")
    const mainContent = document.querySelector(".main-content-area")

    if (window.innerWidth <= 768) {
      // Mobile behavior
      sidebar.style.position = "relative"
      mainContent.style.marginLeft = "0"
    } else {
      // Desktop behavior
      sidebar.style.position = "fixed"
      mainContent.style.marginLeft = "320px"
    }
  }

  // Method to add bookmarks (future enhancement)
  addBookmark(pageNumber) {
    const bookmarks = JSON.parse(localStorage.getItem("investmentGuideBookmarks") || "[]")
    if (!bookmarks.includes(pageNumber)) {
      bookmarks.push(pageNumber)
      localStorage.setItem("investmentGuideBookmarks", JSON.stringify(bookmarks))
    }
  }

  // Method to remove bookmarks (future enhancement)
  removeBookmark(pageNumber) {
    let bookmarks = JSON.parse(localStorage.getItem("investmentGuideBookmarks") || "[]")
    bookmarks = bookmarks.filter((page) => page !== pageNumber)
    localStorage.setItem("investmentGuideBookmarks", JSON.stringify(bookmarks))
  }

  // Method to get reading statistics
  getReadingStats() {
    const progress = (this.currentPage / this.totalPages) * 100
    return {
      currentPage: this.currentPage,
      totalPages: this.totalPages,
      progressPercentage: Math.round(progress),
      pagesRemaining: this.totalPages - this.currentPage,
    }
  }

  // Method to search content (future enhancement)
  searchContent(query) {
    const pages = document.querySelectorAll(".page-content")
    const results = []

    pages.forEach((page, index) => {
      const content = page.textContent.toLowerCase()
      if (content.includes(query.toLowerCase())) {
        results.push({
          page: index + 1,
          title: page.querySelector(".main-heading")?.textContent || `Page ${index + 1}`,
        })
      }
    })

    return results
  }
}

// Utility functions for enhanced user experience
class StudyUtils {
  static formatTime(minutes) {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  static estimateReadingTime(text) {
    const wordsPerMinute = 200
    const words = text.split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  }

  static highlightText(element, query) {
    const text = element.textContent
    const regex = new RegExp(`(${query})`, "gi")
    const highlightedText = text.replace(regex, "<mark>$1</mark>")
    element.innerHTML = highlightedText
  }

  static exportProgress() {
    const progress = localStorage.getItem("investmentGuideProgress")
    const bookmarks = localStorage.getItem("investmentGuideBookmarks")

    const exportData = {
      progress: progress ? JSON.parse(progress) : null,
      bookmarks: bookmarks ? JSON.parse(bookmarks) : [],
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    })

    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "investment-guide-progress.json"
    a.click()
    URL.revokeObjectURL(url)
  }
}

// Initialize the study guide when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const studyGuide = new StudyGuide()

  // Load saved progress
  studyGuide.loadProgress()

  // Add reading time estimates to pages
  document.querySelectorAll(".page-content").forEach((page, index) => {
    const readingTime = StudyUtils.estimateReadingTime(page.textContent)
    const timeElement = document.createElement("div")
    timeElement.className = "reading-time"
    timeElement.innerHTML = `<i class="fas fa-clock"></i> ${readingTime} min read`
    timeElement.style.cssText = `
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: rgba(102, 126, 234, 0.1);
            color: #667eea;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 500;
        `

    const contentHeader = page.querySelector(".content-header")
    if (contentHeader) {
      contentHeader.style.position = "relative"
      contentHeader.appendChild(timeElement)
    }
  })

  // Add progress indicator
  const progressBar = document.createElement("div")
  progressBar.className = "progress-indicator"
  progressBar.innerHTML = `
        <div class="progress-bar">
            <div class="progress-fill" style="width: ${(studyGuide.currentPage / studyGuide.totalPages) * 100}%"></div>
        </div>
    `
  progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 320px;
        right: 0;
        height: 4px;
        background: #e2e8f0;
        z-index: 1001;
    `

  const progressFill = progressBar.querySelector(".progress-fill")
  progressFill.style.cssText = `
        height: 100%;
        background: linear-gradient(90deg, #667eea, #764ba2);
        transition: width 0.3s ease;
    `

  document.body.appendChild(progressBar)

  // Update progress bar when page changes
  const originalGoToPage = studyGuide.goToPage.bind(studyGuide)
  studyGuide.goToPage = function (pageNumber) {
    originalGoToPage(pageNumber)
    progressFill.style.width = `${(this.currentPage / this.totalPages) * 100}%`
  }

  // Make studyGuide globally accessible for debugging
  window.studyGuide = studyGuide
  window.StudyUtils = StudyUtils
})

// Add smooth transitions and animations
// document.addEventListener("DOMContentLoaded", () => {
//   // Add loading animation
//   const loader = document.createElement("div")
//   loader.className = "page-loader"
//   loader.innerHTML = `
//         <div class="loader-content">
//             <div class="spinner"></div>
//             <p>Loading Investment Guide...</p>
//         </div>
//     `
//   loader.style.cssText = `
//         position: fixed;
//         top: 0;
//         left: 0;
//         width: 100%;
//         height: 100%;
//         background: rgba(255, 255, 255, 0.9);
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         z-index: 9999;
//         opacity: 1;
//         transition: opacity 0.5s ease;
//     `

//   const loaderContent = loader.querySelector(".loader-content")
//   loaderContent.style.cssText = `
//         text-align: center;
//         color: #667eea;
//     `

//   const spinner = loader.querySelector(".spinner")
//   spinner.style.cssText = `
//         width: 40px;
//         height: 40px;
//         border: 4px solid #e2e8f0;
//         border-top: 4px solid #667eea;
//         border-radius: 50%;
//         animation: spin 1s linear infinite;
//         margin: 0 auto 1rem;
//     `

//   // Add spinner animation
//   const style = document.createElement("style")
//   style.textContent = `
//         @keyframes spin {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(360deg); }
//         }
//     `
//   document.head.appendChild(style)

//   document.body.appendChild(loader)

//   // Remove loader after content is ready
//   setTimeout(() => {
//     loader.style.opacity = "0"
//     setTimeout(() => {
//       loader.remove()
//     }, 500)
//   }, 1500)
// })

// Remove .html from all internal links
document.querySelectorAll('a[href$=".html"]').forEach(link => {
    link.href = link.href.replace('.html', '');
});