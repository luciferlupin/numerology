// Initialize event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Get form element
  const form = document.getElementById('numerologyForm');
  if (form) {
    form.addEventListener('submit', calculateNumerology);
  }
  
  // Add input validation for date format
  const birthdateInput = document.getElementById('birthdate');
  if (birthdateInput) {
    birthdateInput.addEventListener('blur', function() {
      validateDateFormat(this);
    });
    
    birthdateInput.addEventListener('input', function() {
      // Auto-format as user types
      formatDateInput(this);
    });
  }
  
  // Initialize other components
  initAnimations();
  checkForSavedResults();
  
  // Make all text visible
  makeAllTextVisible();
  
  // Initialize mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('nav ul');
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });
  }

  // Initialize testimonial slider if it exists
  initTestimonialSlider();
    
  // Initialize service cards
  initServiceCards();
    
  // Initialize service sections on services page
  initServiceSections();
    
  // Initialize the How Numerology Works section
  initNumerologyChart();
    
  // Add data-service-id attributes to service cards if they don't have them
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    if (!card.getAttribute('data-service-id')) {
      const link = card.querySelector('a');
      if (link && link.getAttribute('href')) {
        const serviceId = link.getAttribute('href').split('#')[1];
        if (serviceId) {
          card.setAttribute('data-service-id', serviceId);
        }
      }
    }
  });
    
  // Initialize page-specific functionality
  initPageSpecific();
  
  // Initialize the numerology calculator
  const numerologyForm = document.getElementById('numerologyForm');
  if (numerologyForm) {
    numerologyForm.addEventListener('submit', calculateNumerology);
    
    // Add input animations
    const inputs = document.querySelectorAll('.animated-input');
    inputs.forEach(input => {
      input.addEventListener('focus', function() {
        this.parentElement.classList.add('input-focused');
      });
      
      input.addEventListener('blur', function() {
        this.parentElement.classList.remove('input-focused');
      });
    });
    
    // Enhanced date picker initialization
    initEnhancedDatePicker();
    
    // Initialize buttons
    const saveResultsBtn = document.getElementById('saveResults');
    const printResultsBtn = document.getElementById('printResults');
    const shareResultsBtn = document.getElementById('shareResults');
    
    if (saveResultsBtn) {
      saveResultsBtn.addEventListener('click', saveResults);
    }
    
    if (printResultsBtn) {
      printResultsBtn.addEventListener('click', printResults);
    }
    
    if (shareResultsBtn) {
      shareResultsBtn.addEventListener('click', shareResults);
    }
    
    // Check for saved results
    checkForSavedResults();
    
    // Initialize form animations
    initFormAnimations();
  }
  
  // Call again after a short delay to catch any dynamically loaded content
  setTimeout(makeAllTextVisible, 1000);
});

/**
 * Validate date format (YYYY-MM-DD)
 * @param {HTMLInputElement} input - Date input element
 */
function validateDateFormat(input) {
  const value = input.value.trim();
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  
  if (!value) {
    // Empty is handled by required attribute
    return;
  }
  
  if (!dateRegex.test(value)) {
    showError('Please enter date in YYYY-MM-DD format (e.g., 1990-05-15)');
    input.classList.add('input-error');
    return false;
  }
  
  // Check if it's a valid date
  const parts = value.split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Months are 0-indexed in JS
  const day = parseInt(parts[2], 10);
  
  const date = new Date(year, month, day);
  
  // Check if the date is valid
  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
    showError('Please enter a valid date');
    input.classList.add('input-error');
    return false;
  }
  
  // Check if date is in the future
  const today = new Date();
  if (date > today) {
    showError('Date of birth cannot be in the future');
    input.classList.add('input-error');
    return false;
  }
  
  // Valid date
  input.classList.remove('input-error');
  return true;
}

/**
 * Format date input as user types (YYYY-MM-DD)
 * @param {HTMLInputElement} input - Date input element
 */
function formatDateInput(input) {
  let value = input.value.replace(/\D/g, ''); // Remove non-digits
  
  // Format as YYYY-MM-DD
  if (value.length > 0) {
    if (value.length <= 4) {
      // Just the year part
      input.value = value;
    } else if (value.length <= 6) {
      // Year and month
      input.value = value.substring(0, 4) + '-' + value.substring(4);
    } else {
      // Full date
      input.value = value.substring(0, 4) + '-' + value.substring(4, 6) + '-' + value.substring(6, 8);
    }
  }
  
  // Remove error class while typing
  input.classList.remove('input-error');
}

/**
 * Calculate numerology values based on form input
 * @param {Event} e - Form submit event
 */
function calculateNumerology(e) {
  e.preventDefault();
  
  // Add loading animation to button
  const submitBtn = document.querySelector('.calculate-btn');
  submitBtn.innerHTML = '<span class="btn-text">Calculating...</span><span class="btn-icon"><i class="fas fa-spinner fa-spin"></i></span>';
  submitBtn.disabled = true;
  
  // Get form values
  const fullName = document.getElementById('fullName').value.trim();
  const birthdate = document.getElementById('birthdate').value.trim();
  
  // Validate inputs
  if (!fullName || !birthdate) {
    showError('Please enter both your full name and date of birth.');
    resetButton(submitBtn);
    return;
  }
  
  if (fullName.length < 2) {
    showError('Please enter your full name (minimum 2 characters).');
    resetButton(submitBtn);
    return;
  }
  
  // Validate date format
  const birthdateInput = document.getElementById('birthdate');
  if (!validateDateFormat(birthdateInput)) {
    resetButton(submitBtn);
    return;
  }
  
  // Calculate numerology numbers
  const lifePathNumber = calculateLifePathNumber(birthdate);
  const destinyNumber = calculateDestinyNumber(fullName);
  const personalityNumber = calculatePersonalityNumber(fullName);
  const soulUrgeNumber = calculateSoulUrgeNumber(fullName);
  
  // Simulate calculation delay for better UX
  setTimeout(() => {
    displayResults(lifePathNumber, destinyNumber, personalityNumber, soulUrgeNumber);
    resetButton(submitBtn);
    
    // Scroll to results with smooth animation
    const resultsSection = document.getElementById('results');
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 1200);
}

/**
 * Initialize enhanced date picker for better user experience
 */
function initEnhancedDatePicker() {
  const birthdateInput = document.getElementById('birthdate');
  if (!birthdateInput) return;
  
  // Make the input field larger and more noticeable
  birthdateInput.classList.add('enhanced-date-input');
  
  // Add click event to show custom calendar
  birthdateInput.addEventListener('click', function(e) {
    // Prevent the default calendar from showing on some browsers
    if (window.innerWidth > 768) {
      e.preventDefault();
      showCustomCalendar(this);
    }
  });
  
  // Create custom calendar container if it doesn't exist
  if (!document.querySelector('.custom-calendar-container')) {
    createCustomCalendar();
  }
}

/**
 * Create custom calendar elements
 */
function createCustomCalendar() {
  // Create container
  const calendarContainer = document.createElement('div');
  calendarContainer.className = 'custom-calendar-container';
  
  // Create calendar
  const calendar = document.createElement('div');
  calendar.className = 'custom-calendar';
  
  // Create calendar header
  const calendarHeader = document.createElement('div');
  calendarHeader.className = 'calendar-header';
  
  const calendarTitle = document.createElement('div');
  calendarTitle.className = 'calendar-title';
  calendarTitle.textContent = 'Select Your Birth Date';
  
  const calendarNav = document.createElement('div');
  calendarNav.className = 'calendar-nav';
  
  const prevBtn = document.createElement('button');
  prevBtn.className = 'calendar-nav-btn prev-month';
  prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
  prevBtn.setAttribute('aria-label', 'Previous month');
  
  const nextBtn = document.createElement('button');
  nextBtn.className = 'calendar-nav-btn next-month';
  nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
  nextBtn.setAttribute('aria-label', 'Next month');
  
  calendarNav.appendChild(prevBtn);
  calendarNav.appendChild(nextBtn);
  
  calendarHeader.appendChild(calendarTitle);
  calendarHeader.appendChild(calendarNav);
  
  // Create selection mode tabs
  const selectionTabs = document.createElement('div');
  selectionTabs.className = 'selection-tabs';
  
  const dayTab = document.createElement('button');
  dayTab.className = 'selection-tab active';
  dayTab.textContent = 'Day';
  dayTab.dataset.mode = 'day';
  
  const monthTab = document.createElement('button');
  monthTab.className = 'selection-tab';
  monthTab.textContent = 'Month';
  monthTab.dataset.mode = 'month';
  
  const yearTab = document.createElement('button');
  yearTab.className = 'selection-tab';
  yearTab.textContent = 'Year';
  yearTab.dataset.mode = 'year';
  
  selectionTabs.appendChild(dayTab);
  selectionTabs.appendChild(monthTab);
  selectionTabs.appendChild(yearTab);
  
  // Create calendar grid
  const calendarGrid = document.createElement('div');
  calendarGrid.className = 'calendar-grid';
  
  // Create month selection grid (initially hidden)
  const monthGrid = document.createElement('div');
  monthGrid.className = 'month-grid';
  monthGrid.style.display = 'none';
  
  // Create year selection grid (initially hidden)
  const yearGrid = document.createElement('div');
  yearGrid.className = 'year-grid';
  yearGrid.style.display = 'none';
  
  // Create calendar actions
  const calendarActions = document.createElement('div');
  calendarActions.className = 'calendar-actions';
  
  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'calendar-btn calendar-btn-cancel';
  cancelBtn.textContent = 'Cancel';
  
  const confirmBtn = document.createElement('button');
  confirmBtn.className = 'calendar-btn calendar-btn-confirm';
  confirmBtn.textContent = 'Confirm';
  
  calendarActions.appendChild(cancelBtn);
  calendarActions.appendChild(confirmBtn);
  
  // Assemble calendar
  calendar.appendChild(calendarHeader);
  calendar.appendChild(selectionTabs);
  calendar.appendChild(calendarGrid);
  calendar.appendChild(monthGrid);
  calendar.appendChild(yearGrid);
  calendar.appendChild(calendarActions);
  
  calendarContainer.appendChild(calendar);
  document.body.appendChild(calendarContainer);
  
  // Add event listeners
  prevBtn.addEventListener('click', () => navigateMonth(-1));
  nextBtn.addEventListener('click', () => navigateMonth(1));
  cancelBtn.addEventListener('click', hideCustomCalendar);
  confirmBtn.addEventListener('click', confirmDate);
  
  // Add event listeners for tabs
  dayTab.addEventListener('click', () => switchCalendarMode('day'));
  monthTab.addEventListener('click', () => switchCalendarMode('month'));
  yearTab.addEventListener('click', () => switchCalendarMode('year'));
  
  // Close when clicking outside
  calendarContainer.addEventListener('click', function(e) {
    if (e.target === calendarContainer) {
      hideCustomCalendar();
    }
  });
}

/**
 * Show custom calendar
 * @param {HTMLElement} inputElement - Date input element
 */
function showCustomCalendar(inputElement) {
  const calendarContainer = document.querySelector('.custom-calendar-container');
  if (!calendarContainer) return;
  
  // Store reference to the input
  calendarContainer.dataset.inputId = inputElement.id;
  
  // Get current date from input or use today
  let currentDate;
  if (inputElement.value) {
    currentDate = new Date(inputElement.value);
  } else {
    currentDate = new Date();
    // Set year to a reasonable default for birthdate (e.g., 20 years ago)
    currentDate.setFullYear(currentDate.getFullYear() - 20);
  }
  
  // Store current date
  calendarContainer.dataset.currentYear = currentDate.getFullYear();
  calendarContainer.dataset.currentMonth = currentDate.getMonth();
  calendarContainer.dataset.selectedDate = inputElement.value || '';
  
  // Render calendar
  renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
  
  // Show calendar with animation
  calendarContainer.classList.add('active');
  
  // Add accessibility attributes
  calendarContainer.setAttribute('role', 'dialog');
  calendarContainer.setAttribute('aria-modal', 'true');
  calendarContainer.setAttribute('aria-label', 'Date picker');
}

/**
 * Hide custom calendar
 */
function hideCustomCalendar() {
  const calendarContainer = document.querySelector('.custom-calendar-container');
  if (calendarContainer) {
    calendarContainer.classList.remove('active');
  }
}

/**
 * Render calendar for specific month and year
 * @param {number} year - Year to display
 * @param {number} month - Month to display (0-11)
 */
function renderCalendar(year, month) {
  const calendarGrid = document.querySelector('.calendar-grid');
  const calendarTitle = document.querySelector('.calendar-title');
  if (!calendarGrid || !calendarTitle) return;
  
  // Clear grid
  calendarGrid.innerHTML = '';
  
  // Update title
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                     'July', 'August', 'September', 'October', 'November', 'December'];
  calendarTitle.textContent = `${monthNames[month]} ${year}`;
  
  // Add weekday headers
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  weekdays.forEach(day => {
    const weekdayEl = document.createElement('div');
    weekdayEl.className = 'calendar-weekday';
    weekdayEl.textContent = day;
    calendarGrid.appendChild(weekdayEl);
  });
  
  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Get selected date if any
  const calendarContainer = document.querySelector('.custom-calendar-container');
  const selectedDateStr = calendarContainer.dataset.selectedDate;
  let selectedDate = null;
  if (selectedDateStr) {
    selectedDate = new Date(selectedDateStr);
  }
  
  // Add empty cells for days before first day of month
  for (let i = 0; i < firstDay; i++) {
    const emptyDay = document.createElement('div');
    emptyDay.className = 'calendar-day disabled';
    calendarGrid.appendChild(emptyDay);
  }
  
  // Add days of month
  const today = new Date();
  for (let day = 1; day <= daysInMonth; day++) {
    const dayEl = document.createElement('div');
    dayEl.className = 'calendar-day';
    dayEl.textContent = day;
    dayEl.dataset.day = day;
    dayEl.dataset.month = month;
    dayEl.dataset.year = year;
    
    // Check if this is today
    if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
      dayEl.classList.add('current');
    }
    
    // Check if this is the selected date
    if (selectedDate && year === selectedDate.getFullYear() && 
        month === selectedDate.getMonth() && day === selectedDate.getDate()) {
      dayEl.classList.add('selected');
    }
    
    // Add click event
    dayEl.addEventListener('click', function() {
      // Remove selected class from all days
      document.querySelectorAll('.calendar-day.selected').forEach(el => {
        el.classList.remove('selected');
      });
      
      // Add selected class to clicked day
      this.classList.add('selected');
      
      // Update selected date
      const selectedYear = parseInt(this.dataset.year);
      const selectedMonth = parseInt(this.dataset.month);
      const selectedDay = parseInt(this.dataset.day);
      
      // Format date as YYYY-MM-DD
      const formattedMonth = (selectedMonth + 1).toString().padStart(2, '0');
      const formattedDay = selectedDay.toString().padStart(2, '0');
      calendarContainer.dataset.selectedDate = `${selectedYear}-${formattedMonth}-${formattedDay}`;
    });
    
    calendarGrid.appendChild(dayEl);
  }
}

/**
 * Switch between day, month, and year selection modes
 * @param {string} mode - Selection mode ('day', 'month', or 'year')
 */
function switchCalendarMode(mode) {
  const calendarContainer = document.querySelector('.custom-calendar-container');
  if (!calendarContainer) return;
  
  // Update active tab
  const tabs = document.querySelectorAll('.selection-tab');
  tabs.forEach(tab => {
    tab.classList.toggle('active', tab.dataset.mode === mode);
  });
  
  // Show/hide appropriate grid
  const calendarGrid = document.querySelector('.calendar-grid');
  const monthGrid = document.querySelector('.month-grid');
  const yearGrid = document.querySelector('.year-grid');
  
  calendarGrid.style.display = mode === 'day' ? 'grid' : 'none';
  monthGrid.style.display = mode === 'month' ? 'grid' : 'none';
  yearGrid.style.display = mode === 'year' ? 'grid' : 'none';
  
  // Update navigation buttons visibility
  const prevBtn = document.querySelector('.prev-month');
  const nextBtn = document.querySelector('.next-month');
  
  if (mode === 'year') {
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    prevBtn.setAttribute('aria-label', 'Previous years');
    nextBtn.setAttribute('aria-label', 'Next years');
  } else {
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    prevBtn.setAttribute('aria-label', 'Previous month');
    nextBtn.setAttribute('aria-label', 'Next month');
  }
  
  // Store current mode
  calendarContainer.dataset.mode = mode;
  
  // Render appropriate view
  const currentYear = parseInt(calendarContainer.dataset.currentYear);
  const currentMonth = parseInt(calendarContainer.dataset.currentMonth);
  
  if (mode === 'day') {
    renderCalendar(currentYear, currentMonth);
  } else if (mode === 'month') {
    renderMonthGrid(currentYear);
  } else if (mode === 'year') {
    renderYearGrid(currentYear);
  }
}

/**
 * Render month selection grid
 * @param {number} year - Year to display months for
 */
function renderMonthGrid(year) {
  const monthGrid = document.querySelector('.month-grid');
  const calendarTitle = document.querySelector('.calendar-title');
  if (!monthGrid || !calendarTitle) return;
  
  // Update title
  calendarTitle.textContent = `${year}`;
  
  // Clear grid
  monthGrid.innerHTML = '';
  
  // Add months
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                     'July', 'August', 'September', 'October', 'November', 'December'];
  
  const calendarContainer = document.querySelector('.custom-calendar-container');
  const selectedDateStr = calendarContainer.dataset.selectedDate;
  let selectedDate = null;
  if (selectedDateStr) {
    selectedDate = new Date(selectedDateStr);
  }
  
  monthNames.forEach((month, index) => {
    const monthEl = document.createElement('div');
    monthEl.className = 'month-item';
    monthEl.textContent = month;
    monthEl.dataset.month = index;
    monthEl.dataset.year = year;
    
    // Check if this is the selected month
    if (selectedDate && year === selectedDate.getFullYear() && index === selectedDate.getMonth()) {
      monthEl.classList.add('selected');
    }
    
    // Add click event
    monthEl.addEventListener('click', function() {
      // Remove selected class from all months
      document.querySelectorAll('.month-item.selected').forEach(el => {
        el.classList.remove('selected');
      });
      
      // Add selected class to clicked month
      this.classList.add('selected');
      
      // Update selected month
      const selectedYear = parseInt(this.dataset.year);
      const selectedMonth = parseInt(this.dataset.month);
      
      // Update stored values
      calendarContainer.dataset.currentYear = selectedYear;
      calendarContainer.dataset.currentMonth = selectedMonth;
      
      // If we have a selected date, update it with the new month
      if (selectedDateStr) {
        const currentDate = new Date(selectedDateStr);
        const day = currentDate.getDate();
        
        // Create new date with selected month
        const newDate = new Date(selectedYear, selectedMonth, day);
        
        // Format date as YYYY-MM-DD
        const formattedMonth = (selectedMonth + 1).toString().padStart(2, '0');
        const formattedDay = day.toString().padStart(2, '0');
        calendarContainer.dataset.selectedDate = `${selectedYear}-${formattedMonth}-${formattedDay}`;
      }
      
      // Switch to day view after selecting a month
      switchCalendarMode('day');
    });
    
    monthGrid.appendChild(monthEl);
  });
}

/**
 * Render year selection grid
 * @param {number} startYear - Starting year for the grid
 */
function renderYearGrid(startYear) {
  const yearGrid = document.querySelector('.year-grid');
  const calendarTitle = document.querySelector('.calendar-title');
  if (!yearGrid || !calendarTitle) return;
  
  // Calculate start year (round down to nearest decade)
  const decadeStart = Math.floor(startYear / 10) * 10;
  
  // Update title
  calendarTitle.textContent = `${decadeStart} - ${decadeStart + 11}`;
  
  // Clear grid
  yearGrid.innerHTML = '';
  
  // Get selected date if any
  const calendarContainer = document.querySelector('.custom-calendar-container');
  const selectedDateStr = calendarContainer.dataset.selectedDate;
  let selectedDate = null;
  if (selectedDateStr) {
    selectedDate = new Date(selectedDateStr);
  }
  
  // Add years (12 years per page)
  for (let i = 0; i < 12; i++) {
    const year = decadeStart + i;
    const yearEl = document.createElement('div');
    yearEl.className = 'year-item';
    yearEl.textContent = year;
    yearEl.dataset.year = year;
    
    // Check if this is the selected year
    if (selectedDate && year === selectedDate.getFullYear()) {
      yearEl.classList.add('selected');
    }
    
    // Add click event
    yearEl.addEventListener('click', function() {
      // Remove selected class from all years
      document.querySelectorAll('.year-item.selected').forEach(el => {
        el.classList.remove('selected');
      });
      
      // Add selected class to clicked year
      this.classList.add('selected');
      
      // Update selected year
      const selectedYear = parseInt(this.dataset.year);
      
      // Update stored values
      calendarContainer.dataset.currentYear = selectedYear;
      
      // If we have a selected date, update it with the new year
      if (selectedDateStr) {
        const currentDate = new Date(selectedDateStr);
        const month = currentDate.getMonth();
        const day = currentDate.getDate();
        
        // Create new date with selected year
        const newDate = new Date(selectedYear, month, day);
        
        // Format date as YYYY-MM-DD
        const formattedMonth = (month + 1).toString().padStart(2, '0');
        const formattedDay = day.toString().padStart(2, '0');
        calendarContainer.dataset.selectedDate = `${selectedYear}-${formattedMonth}-${formattedDay}`;
      }
      
      // Switch to month view after selecting a year
      switchCalendarMode('month');
    });
    
    yearGrid.appendChild(yearEl);
  }
  
  // Store the decade start for navigation
  calendarContainer.dataset.decadeStart = decadeStart;
}

/**
 * Navigate to previous or next month/year
 * @param {number} direction - Direction to navigate (-1 for previous, 1 for next)
 */
function navigateMonth(direction) {
  const calendarContainer = document.querySelector('.custom-calendar-container');
  if (!calendarContainer) return;
  
  const mode = calendarContainer.dataset.mode || 'day';
  
  if (mode === 'day') {
    let currentYear = parseInt(calendarContainer.dataset.currentYear);
    let currentMonth = parseInt(calendarContainer.dataset.currentMonth);
    
    // Update month and year
    currentMonth += direction;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    } else if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    
    // Update stored values
    calendarContainer.dataset.currentYear = currentYear;
    calendarContainer.dataset.currentMonth = currentMonth;
    
    // Render new month
    renderCalendar(currentYear, currentMonth);
  } else if (mode === 'month') {
    let currentYear = parseInt(calendarContainer.dataset.currentYear);
    
    // Update year
    currentYear += direction;
    
    // Update stored values
    calendarContainer.dataset.currentYear = currentYear;
    
    // Render new year of months
    renderMonthGrid(currentYear);
  } else if (mode === 'year') {
    let decadeStart = parseInt(calendarContainer.dataset.decadeStart);
    
    // Update decade
    decadeStart += direction * 12;
    
    // Render new decade
    renderYearGrid(decadeStart);
  }
}

/**
 * Confirm selected date and update input
 */
function confirmDate() {
  const calendarContainer = document.querySelector('.custom-calendar-container');
  if (!calendarContainer) return;
  
  const inputId = calendarContainer.dataset.inputId;
  const selectedDate = calendarContainer.dataset.selectedDate;
  const mode = calendarContainer.dataset.mode || 'day';
  
  if (inputId) {
    const inputElement = document.getElementById(inputId);
    if (inputElement) {
      // Handle different modes
      if (mode === 'day' && selectedDate) {
        // Full date selected
        inputElement.value = selectedDate;
      } else if (mode === 'month') {
        // Only month and year selected
        const currentYear = parseInt(calendarContainer.dataset.currentYear);
        const currentMonth = parseInt(calendarContainer.dataset.currentMonth);
        
        // Format as YYYY-MM
        const formattedMonth = (currentMonth + 1).toString().padStart(2, '0');
        inputElement.value = `${currentYear}-${formattedMonth}`;
      } else if (mode === 'year') {
        // Only year selected
        const currentYear = parseInt(calendarContainer.dataset.currentYear);
        inputElement.value = `${currentYear}`;
      }
      
      // Trigger change event
      const event = new Event('change', { bubbles: true });
      inputElement.dispatchEvent(event);
    }
  }
  
  hideCustomCalendar();
}

/**
 * Show error message to the user
 * @param {string} message - Error message to display
 */
function showError(message) {
  // Check if error container exists, if not create one
  let errorContainer = document.querySelector('.error-message');
  if (!errorContainer) {
    errorContainer = document.createElement('div');
    errorContainer.className = 'error-message';
    const form = document.getElementById('numerologyForm');
    form.insertBefore(errorContainer, form.firstChild);
  }
  
  // Set error message and show it
  errorContainer.textContent = message;
  errorContainer.style.display = 'block';
  errorContainer.classList.add('shake-animation');
  
  // Remove animation class after animation completes
  setTimeout(() => {
    errorContainer.classList.remove('shake-animation');
  }, 500);
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    errorContainer.style.display = 'none';
  }, 5000);
}

/**
 * Reset button to original state
 * @param {HTMLElement} button - Button element to reset
 */
function resetButton(button) {
  button.innerHTML = '<span class="btn-text">Calculate My Numbers</span><span class="btn-icon"><i class="fas fa-calculator"></i></span>';
  button.disabled = false;
}

/**
 * Initialize form animations and interactivity
 */
function initFormAnimations() {
  const inputs = document.querySelectorAll('.animated-input');
  
  inputs.forEach(input => {
    const wrapper = input.closest('.input-wrapper');
    
    // Add focus events
    input.addEventListener('focus', () => {
      wrapper.classList.add('input-focused');
    });
    
    input.addEventListener('blur', () => {
      wrapper.classList.remove('input-focused');
      
      // Add 'filled' class if input has value
      if (input.value.trim() !== '') {
        wrapper.classList.add('input-filled');
      } else {
        wrapper.classList.remove('input-filled');
      }
    });
    
    // Check initial state
    if (input.value.trim() !== '') {
      wrapper.classList.add('input-filled');
    }
  });
  
  // Add hover animations to result cards
  const resultCards = document.querySelectorAll('.result-card');
  resultCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      const numberEl = card.querySelector('.result-number');
      if (numberEl) {
        numberEl.style.transform = 'scale(1.1)';
        numberEl.style.textShadow = '0 0 10px rgba(255, 123, 0, 0.3)';
      }
    });
    
    card.addEventListener('mouseleave', () => {
      const numberEl = card.querySelector('.result-number');
      if (numberEl) {
        numberEl.style.transform = '';
        numberEl.style.textShadow = '';
      }
    });
  });
  
  // Add shimmer effect to calculate button
  const calculateBtn = document.querySelector('.calculate-btn');
  if (calculateBtn) {
    calculateBtn.addEventListener('mouseenter', () => {
      calculateBtn.classList.add('btn-shimmer');
    });
    
    calculateBtn.addEventListener('mouseleave', () => {
      calculateBtn.classList.remove('btn-shimmer');
    });
  }
}

/**
 * Calculate Life Path Number from date of birth
 * @param {string} birthdate - Date of birth in YYYY-MM-DD format
 * @returns {number} Life Path Number (1-9, 11, 22, or 33)
 */
function calculateLifePathNumber(birthdate) {
  if (!birthdate) return null;
  
  // Split the date into year, month, day
  const parts = birthdate.split('-');
  if (parts.length !== 3) return null;
  
  const year = parts[0];
  const month = parts[1];
  const day = parts[2];
  
  // Calculate sum of each component
  const yearSum = reduceToSingleDigit(year, true);
  const monthSum = reduceToSingleDigit(month, true);
  const daySum = reduceToSingleDigit(day, true);
  
  // Calculate total sum
  let sum = yearSum + monthSum + daySum;
  
  // Reduce to a single digit or master number
  return reduceToSingleDigit(sum, true);
}

/**
 * Calculate Destiny Number from full name
 * @param {string} fullName - Full name
 * @returns {number} Destiny Number (1-9, 11, 22, or 33)
 */
function calculateDestinyNumber(fullName) {
  if (!fullName) return null;
  
  // Convert name to uppercase and remove non-alphabetic characters
  const name = fullName.toUpperCase().replace(/[^A-Z]/g, '');
  
  // Calculate sum of all letters
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += getLetterValue(name[i]);
  }
  
  // Reduce to a single digit or master number
  return reduceToSingleDigit(sum, true);
}

/**
 * Calculate Personality Number from consonants in name
 * @param {string} fullName - Full name
 * @returns {number} Personality Number (1-9, 11, 22, or 33)
 */
function calculatePersonalityNumber(fullName) {
  if (!fullName) return null;
  
  // Convert name to uppercase and remove non-alphabetic characters
  const name = fullName.toUpperCase().replace(/[^A-Z]/g, '');
  
  // Calculate sum of consonants
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    const letter = name[i];
    // Check if letter is a consonant
    if (!'AEIOU'.includes(letter)) {
      sum += getLetterValue(letter);
    }
  }
  
  // Reduce to a single digit or master number
  return reduceToSingleDigit(sum, true);
}

/**
 * Calculate Soul Urge Number from vowels in name
 * @param {string} fullName - Full name
 * @returns {number} Soul Urge Number (1-9, 11, 22, or 33)
 */
function calculateSoulUrgeNumber(fullName) {
  if (!fullName) return null;
  
  // Convert name to uppercase and remove non-alphabetic characters
  const name = fullName.toUpperCase().replace(/[^A-Z]/g, '');
  
  // Calculate sum of vowels
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    const letter = name[i];
    // Check if letter is a vowel
    if ('AEIOU'.includes(letter)) {
      sum += getLetterValue(letter);
    }
  }
  
  // Reduce to a single digit or master number
  return reduceToSingleDigit(sum, true);
}

/**
 * Get numerology value of a letter (A=1, B=2, ..., Z=26)
 * @param {string} letter - Single letter
 * @returns {number} Numerology value
 */
function getLetterValue(letter) {
  const letterValues = {
    'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
    'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
    'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8
  };
  
  return letterValues[letter] || 0;
}

/**
 * Reduce a number to a single digit, preserving master numbers
 * @param {number|string} num - Number to reduce
 * @param {boolean} preserveMaster - Whether to preserve master numbers (11, 22, 33)
 * @returns {number} Reduced number
 */
function reduceToSingleDigit(num, preserveMaster = false) {
  // Convert to string and remove non-digits
  const numStr = num.toString().replace(/\D/g, '');
  
  // If empty, return 0
  if (!numStr) return 0;
  
  // Calculate sum of digits
  let sum = 0;
  for (let i = 0; i < numStr.length; i++) {
    sum += parseInt(numStr[i]);
  }
  
  // Check for master numbers
  if (preserveMaster && (sum === 11 || sum === 22 || sum === 33)) {
    return sum;
  }
  
  // Recursively reduce until we get a single digit
  if (sum > 9) {
    return reduceToSingleDigit(sum, preserveMaster);
  }
  
  return sum;
}

/**
 * Display numerology results
 * @param {number} lifePathNumber - Life Path Number
 * @param {number} destinyNumber - Destiny Number
 * @param {number} personalityNumber - Personality Number
 * @param {number} soulUrgeNumber - Soul Urge Number
 */
function displayResults(lifePathNumber, destinyNumber, personalityNumber, soulUrgeNumber) {
  // Show results container
  const resultsContainer = document.getElementById('results');
  if (resultsContainer) {
    resultsContainer.style.display = 'block';
  }
  
  // Update number displays
  updateNumberDisplay('lifePathNumber', lifePathNumber);
  updateNumberDisplay('destinyNumber', destinyNumber);
  updateNumberDisplay('personalityNumber', personalityNumber);
  updateNumberDisplay('soulUrgeNumber', soulUrgeNumber);
  
  // Update descriptions
  updateDescription('lifePathDescription', getNumberDescription(lifePathNumber, 'lifePath'));
  updateDescription('destinyDescription', getNumberDescription(destinyNumber, 'destiny'));
  updateDescription('personalityDescription', getNumberDescription(personalityNumber, 'personality'));
  updateDescription('soulUrgeDescription', getNumberDescription(soulUrgeNumber, 'soulUrge'));
  
  // Save results to localStorage
  saveResultsToLocalStorage(lifePathNumber, destinyNumber, personalityNumber, soulUrgeNumber);
}

/**
 * Update number display with animation
 * @param {string} elementId - ID of element to update
 * @param {number} number - Number to display
 */
function updateNumberDisplay(elementId, number) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  // Clear existing content
  element.textContent = '';
  
  // Add animation class
  element.classList.add('animate-number');
  
  // Animate number counting up
  let count = 0;
  const interval = setInterval(() => {
    if (count >= number) {
      clearInterval(interval);
      element.textContent = number;
      element.classList.remove('animate-number');
      element.classList.add('number-complete');
    } else {
      count++;
      element.textContent = count;
    }
  }, 100);
}

/**
 * Update description with animation
 * @param {string} elementId - ID of element to update
 * @param {string} description - Description to display
 */
function updateDescription(elementId, description) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  // Clear existing content
  element.textContent = '';
  
  // Add animation class
  element.classList.add('animate-text');
  
  // Add description with typing effect
  let index = 0;
  const interval = setInterval(() => {
    if (index >= description.length) {
      clearInterval(interval);
      element.classList.remove('animate-text');
    } else {
      element.textContent += description[index];
      index++;
    }
  }, 20);
}

/**
 * Get description for a numerology number
 * @param {number} number - Numerology number
 * @param {string} type - Type of number (lifePath, destiny, personality, soulUrge)
 * @returns {string} Description
 */
function getNumberDescription(number, type) {
  const descriptions = {
    lifePath: {
      1: "You are a natural leader with strong individuality and determination. Your path is about innovation, independence, and forging your own way.",
      2: "You are diplomatic and cooperative. Your path involves partnerships, sensitivity to others, and creating harmony in your surroundings.",
      3: "You are creative and expressive. Your path is about communication, joy, and bringing your creative visions into reality.",
      4: "You are practical and methodical. Your path involves building solid foundations, hard work, and creating order from chaos.",
      5: "You are adaptable and freedom-loving. Your path involves embracing change, adventure, and learning through diverse experiences.",
      6: "You are nurturing and responsible. Your path involves service to others, creating harmony in home and community, and accepting responsibilities.",
      7: "You are analytical and spiritual. Your path involves seeking deeper truths, intellectual pursuits, and developing your inner wisdom.",
      8: "You are ambitious and goal-oriented. Your path involves achieving material success, exercising good judgment, and using power wisely.",
      9: "You are compassionate and idealistic. Your path involves humanitarian efforts, completion, and letting go of what no longer serves you.",
      11: "As a master number, you have heightened intuition and spiritual insight. Your path involves inspiring others and bringing illumination.",
      22: "As a master number, you are a master builder. Your path involves turning dreams into reality and creating structures that benefit humanity.",
      33: "As a master number, you are a master teacher. Your path involves selfless service, nurturing others, and expressing unconditional love."
    },
    destiny: {
      1: "Your destiny is to develop independence and leadership. You're here to pioneer new paths and inspire others through your originality and courage.",
      2: "Your destiny is to create harmony and cooperation. You're here to mediate, support, and bring people together through your diplomacy and sensitivity.",
      3: "Your destiny is to express creativity and joy. You're here to communicate, entertain, and uplift others through your artistic talents and optimism.",
      4: "Your destiny is to build stable foundations. You're here to create order, establish systems, and demonstrate reliability through your practical skills.",
      5: "Your destiny is to embrace freedom and change. You're here to experience life fully and inspire adaptability through your versatility and progressive thinking.",
      6: "Your destiny is to nurture and be of service. You're here to create harmony in home and community through your sense of responsibility and compassion.",
      7: "Your destiny is to seek wisdom and truth. You're here to analyze, research, and develop spiritual awareness through your intellectual and intuitive abilities.",
      8: "Your destiny is to achieve material success and authority. You're here to manifest abundance and demonstrate good judgment through your executive abilities.",
      9: "Your destiny is to serve humanity. You're here to complete cycles, let go of attachments, and inspire universal love through your compassion and selflessness.",
      11: "Your destiny is to inspire and enlighten. As a master number, you're here to bring spiritual awareness and intuitive insights to others.",
      22: "Your destiny is to be a master builder. As a master number, you're here to transform visions into practical realities that benefit many.",
      33: "Your destiny is to be a master teacher. As a master number, you're here to nurture, heal, and uplift humanity through selfless service and love."
    },
    personality: {
      1: "You appear confident, independent, and pioneering. Others see you as a leader who is original and self-reliant.",
      2: "You appear diplomatic, cooperative, and sensitive. Others see you as a peacemaker who is supportive and attentive to details.",
      3: "You appear expressive, creative, and sociable. Others see you as charming, optimistic, and full of ideas.",
      4: "You appear practical, reliable, and organized. Others see you as dependable, hardworking, and methodical.",
      5: "You appear adventurous, versatile, and progressive. Others see you as adaptable, freedom-loving, and exciting.",
      6: "You appear responsible, nurturing, and harmonious. Others see you as caring, reliable, and service-oriented.",
      7: "You appear analytical, thoughtful, and reserved. Others see you as intelligent, spiritual, and somewhat mysterious.",
      8: "You appear confident, ambitious, and authoritative. Others see you as powerful, goal-oriented, and business-minded.",
      9: "You appear compassionate, sophisticated, and wise. Others see you as humanitarian, artistic, and somewhat detached.",
      11: "You appear intuitive, inspirational, and idealistic. Others see you as visionary, sensitive, and spiritually aware.",
      22: "You appear practical, powerful, and ambitious. Others see you as a master builder with the ability to manifest great things.",
      33: "You appear nurturing, compassionate, and wise. Others see you as a teacher and healer with great depth of understanding."
    },
    soulUrge: {
      1: "Your heart desires independence and achievement. You're driven by a need to lead, create your own path, and make your mark on the world.",
      2: "Your heart desires harmony and connection. You're driven by a need for partnership, peace, and meaningful relationships.",
      3: "Your heart desires self-expression and joy. You're driven by a need to create, communicate, and experience the lighter side of life.",
      4: "Your heart desires stability and order. You're driven by a need for security, structure, and building something lasting.",
      5: "Your heart desires freedom and change. You're driven by a need for variety, adventure, and sensory experiences.",
      6: "Your heart desires to nurture and be of service. You're driven by a need for harmony, beauty, and caring for others.",
      7: "Your heart desires wisdom and understanding. You're driven by a need for knowledge, privacy, and spiritual connection.",
      8: "Your heart desires success and recognition. You're driven by a need for achievement, material comfort, and authority.",
      9: "Your heart desires to make a difference. You're driven by a need for humanitarian work, artistic expression, and universal love.",
      11: "Your heart desires spiritual insight and inspiration. You're driven by a need to illuminate, teach, and connect with higher consciousness.",
      22: "Your heart desires to build something significant. You're driven by a need to transform dreams into reality and create lasting structures.",
      33: "Your heart desires to heal and uplift. You're driven by a need to express unconditional love and nurture the growth of others."
    }
  };
  
  // Return description or default message
  return descriptions[type]?.[number] || "This number represents a unique combination of energies in your numerology chart.";
}

/**
 * Save results to localStorage
 * @param {number} lifePathNumber - Life Path Number
 * @param {number} destinyNumber - Destiny Number
 * @param {number} personalityNumber - Personality Number
 * @param {number} soulUrgeNumber - Soul Urge Number
 */
function saveResultsToLocalStorage(lifePathNumber, destinyNumber, personalityNumber, soulUrgeNumber) {
  const results = {
    lifePathNumber,
    destinyNumber,
    personalityNumber,
    soulUrgeNumber,
    timestamp: new Date().toISOString()
  };
  
  localStorage.setItem('numerologyResults', JSON.stringify(results));
}

/**
 * Check for saved results and display if found
 */
function checkForSavedResults() {
  const savedResults = localStorage.getItem('numerologyResults');
  if (savedResults) {
    try {
      const results = JSON.parse(savedResults);
      
      // Check if results are from today
      const savedDate = new Date(results.timestamp);
      const today = new Date();
      
      // Only show if saved today
      if (savedDate.toDateString() === today.toDateString()) {
        displayResults(
          results.lifePathNumber,
          results.destinyNumber,
          results.personalityNumber,
          results.soulUrgeNumber
        );
      }
    } catch (e) {
      console.error('Error parsing saved results:', e);
    }
  }
}

/**
 * Save results to PDF or image
 */
function saveResults() {
  alert('This feature will allow you to save your results as a PDF or image. Coming soon!');
}

/**
 * Print results
 */
function printResults() {
  window.print();
}

/**
 * Share results on social media
 */
function shareResults() {
  alert('This feature will allow you to share your results on social media. Coming soon!');
}

/**
 * Make all text visible on the website
 * This function ensures all text elements are visible
 */
function makeAllTextVisible() {
  // Find all text elements
  const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, li, label, input, textarea, button, div');
  
  // Make each element visible
  textElements.forEach(element => {
    // Skip elements that should remain hidden (like modals)
    if (element.classList.contains('modal') || element.closest('.modal')) {
      return;
    }
    
    // Make element visible
    element.style.opacity = '1';
    element.style.visibility = 'visible';
    
    // Only change display if it's currently none
    if (window.getComputedStyle(element).display === 'none') {
      // Don't change display for elements that should naturally be hidden
      if (!element.classList.contains('hidden-by-design')) {
        element.style.display = element.tagName.toLowerCase() === 'span' ? 'inline' : 'block';
      }
    }
    
    // Ensure text color has good contrast with its background
    const backgroundColor = window.getComputedStyle(element).backgroundColor;
    if (backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'transparent') {
      // For dark backgrounds, use white text
      if (backgroundColor.includes('rgba(0, 0, 0') || backgroundColor.includes('rgb(0, 0, 0') || 
          backgroundColor.includes('#000') || backgroundColor.includes('#333') || 
          backgroundColor.includes('rgb(51, 51, 51')) {
        element.style.color = '#ffffff';
      } else {
        // For light backgrounds, use dark text
        element.style.color = '#333333';
      }
    }
  });
  
  // Fix any gradient text
  const gradientElements = document.querySelectorAll('[style*="background-clip: text"], [style*="-webkit-background-clip: text"]');
  gradientElements.forEach(element => {
    element.style.backgroundClip = 'unset';
    element.style.webkitBackgroundClip = 'unset';
    element.style.color = '#ff7b00'; // Use primary color
    element.style.webkitTextFillColor = '#ff7b00';
  });
}
