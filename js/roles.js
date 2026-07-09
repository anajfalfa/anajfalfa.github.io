function applyRole() {
    // 1. Check URL Params for role first (from redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const roleParam = urlParams.get('role');
    if (roleParam) {
        sessionStorage.setItem('siteRole', roleParam);
        // Clean URL without refresh
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    const role = sessionStorage.getItem('siteRole') || 'guest';
    const indicator = document.getElementById('role-indicator');
    if (indicator) {
        indicator.textContent = `Role: ${role.charAt(0).toUpperCase() + role.slice(1)}`;
    }

    // Role-specific Navigation Filtering (based on ideas.txt)
    applyNavFilter(role);

    // Role-specific global logic
    if (role === 'ana') {
        // All links are visible, nothing else to toggle now
    }

    // 2. Professor / Researcher specific UI
    if (role === 'professor' || role === 'researcher') {
        injectCollaborationButton(role);
    }
}

function injectCollaborationButton(role) {
    // Only inject if it's a page where it makes sense (Research, Tutoring, Home)
    const pages = ['research', 'tutoring', 'index'];
    const currentPath = window.location.pathname;
    const isRelevantPage = pages.some(p => currentPath.includes(p));

    if (isRelevantPage && !document.getElementById('collab-btn')) {
        const btn = document.createElement('div');
        btn.id = 'collab-btn';
        btn.innerHTML = `
            <div class="collab-banner glass" style="position: fixed; bottom: 20px; right: 20px; z-index: 1000; padding: 15px 20px; border-radius: 12px; border-left: 5px solid #9c59f3; display: flex; align-items: center; gap: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); animation: slideIn 0.5s ease;">
                <div>
                    <h4 style="margin:0; font-size: 0.9em; color: #2c3e50;">${role === 'professor' ? 'Professor' : 'Researcher'} Perspective</h4>
                    <p style="margin:0; font-size: 0.8em; color: #555;">Interested in research collaboration?</p>
                </div>
                <a href="mailto:ana.alfaiate@tecnico.ulisboa.pt" class="cta-button" style="padding: 8px 15px; font-size: 0.8em; margin:0;">Contact Me</a>
                <button onclick="this.parentElement.remove()" style="background:none; border:none; color: #999; cursor:pointer; font-size: 1.2em;">&times;</button>
            </div>
        `;
        document.body.appendChild(btn);
    }
}

function applyNavFilter(role) {
    if (role === 'ana' || !role || role === 'guest') return;

    // Mapping from ideas.txt
    const roleConfig = {
        'student': ['index', 'portfolio', 'cv', 'reviews', 'tutoring', 'podcast', 'resumosalfa'],
        'professor': ['index', 'portfolio', 'cv', 'research', 'reviews', 'podcast', 'tutoring', 'resumosalfa'],
        'researcher': ['index', 'portfolio', 'cv', 'research', 'podcast']
    };

    const allowedPages = roleConfig[role.toLowerCase()] || [];
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const navLinks = navbar.querySelectorAll('a:not(.lang-btn)');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;

        // Check if any allowed page is mentioned in the href
        const isAllowed = allowedPages.some(page => {
            if (page === 'index') return href === 'index.html' || href === 'index-pt.html' || href.startsWith('#');
            if (page === 'podcast') return href.includes('podcast');
            return href.includes(page);
        });

        if (!isAllowed) {
            link.style.display = 'none';
        }
    });

    // Also hide the selector if already in a role (optional, keep for switching?)
    // indicator.style.cursor = 'pointer';
}

window.addEventListener('load', applyRole);
