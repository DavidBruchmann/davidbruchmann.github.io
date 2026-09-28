document.addEventListener('DOMContentLoaded', () => {
  const appearanceSelect = document.querySelector('.appearance-menu select');
  const savedTheme = localStorage.getItem('user-theme');

  // Function to apply the theme to the document root
  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.style.colorScheme = 'dark';
    } else if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.style.colorScheme = 'light';
    } else {
      // System default path
      document.documentElement.removeAttribute('data-theme');
      document.documentElement.style.colorScheme = 'light dark';
    }
  }

  // Load saved theme on startup
  if (savedTheme && appearanceSelect) {
    appearanceSelect.value = savedTheme;
    applyTheme(savedTheme);
  } else {
    applyTheme('system');
  }

  // Listen for changes in the dropdown menu
  if (appearanceSelect) {
    appearanceSelect.addEventListener('change', function() {
      const selectedTheme = this.value;
      localStorage.setItem('user-theme', selectedTheme);
      applyTheme(selectedTheme);
      // Close the language menu toggle after selection
      const appearanceToggle = document.getElementById('appearance-toggle');
      if (appearanceToggle) appearanceToggle.checked = false;
    });
  }
});
