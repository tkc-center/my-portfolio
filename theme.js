document.addEventListener('DOMContentLoaded', () => {
    const themeBtn = document.getElementById('theme-switcher');
    const langBtn = document.getElementById('lang-switcher');
    const themes = ['dark', 'light'];
    const languages = ['EN', 'DE', 'FR'];

    let currentTheme = localStorage.getItem('theme') || 'system';
    let currentLang = localStorage.getItem('language') || 'EN';

    function applyTheme(theme) {
        document.documentElement.classList.remove('light', 'dark');
        if (theme === 'system') {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (systemPrefersDark) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.add('light');
            }
        } else {
            document.documentElement.classList.add(theme);
        }
        localStorage.setItem('theme', theme);
        themeBtn.textContent = theme === 'dark' ? '🌙' : theme === 'light' ? '☀️' : '💻';
    }

    function applyLanguage(lang) {
        // Placeholder for language switching logic
        console.log(`Language switched to: ${lang}`);
        localStorage.setItem('language', lang);
        langBtn.textContent = lang;
    }

    themeBtn.addEventListener('click', () => {
        const currentIndex = themes.indexOf(currentTheme);
        currentTheme = themes[(currentIndex + 1) % themes.length];
        applyTheme(currentTheme);
    });

    langBtn.addEventListener('click', () => {
        const currentIndex = languages.indexOf(currentLang);
        currentLang = languages[(currentIndex + 1) % languages.length];
        applyLanguage(currentLang);
    });

    applyTheme(currentTheme);
    applyLanguage(currentLang);
});