function applyRole() {
    const role = sessionStorage.getItem('siteRole') || 'guest';
    const indicator = document.getElementById('role-indicator');
    if (indicator) {
        indicator.textContent = `Role: ${role.charAt(0).toUpperCase() + role.slice(1)}`;
    }

    // Role-specific global logic
    if (role === 'ana') {
        // Automatically unlock protected sections if they exist
        const ideasLock = document.getElementById('ideas-lock');
        const ideasContent = document.getElementById('ideas-content');
        if (ideasLock && ideasContent) {
            ideasLock.style.display = 'none';
            ideasContent.classList.remove('hidden', 'blur-content');
            ideasContent.classList.add('visible');
        }
        
        // Enable admin features if the function exists on the page
        if (typeof enableAdminMode === 'function') {
            enableAdminMode();
        }
    }
}

window.addEventListener('load', applyRole);
