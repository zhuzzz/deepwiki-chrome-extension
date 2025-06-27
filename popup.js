// DeepWiki GitHub Extension - Popup Script
document.addEventListener('DOMContentLoaded', function() {
    const statusElement = document.getElementById('status');
    const statusText = document.getElementById('status-text');

    // Check if we're on a GitHub tab and update status
    async function checkStatus() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (tab && tab.url) {
                const url = new URL(tab.url);
                
                if (url.hostname === 'github.com') {
                    const pathSegments = url.pathname.split('/').filter(segment => segment.length > 0);
                    
                    if (pathSegments.length >= 2 && 
                        !pathSegments[0].startsWith('@') && 
                        !['marketplace', 'topics', 'collections', 'sponsors', 'about', 'pricing', 'team', 'enterprise', 'nonprofit', 'customer-stories', 'security', 'features', 'search', 'explore', 'issues', 'pull', 'discussions', 'notifications', 'settings', 'organizations', 'new', 'codespaces', 'github', 'orgs'].includes(pathSegments[0])) {
                        
                        // This is a repository page
                        statusElement.className = 'status active';
                        statusText.textContent = `Active on ${pathSegments[0]}/${pathSegments[1]}`;
                        
                        // Add quick link to DeepWiki for this repo
                        addQuickLink(pathSegments[0], pathSegments[1]);
                    } else {
                        // On GitHub but not a repository page
                        statusElement.className = 'status inactive';
                        statusText.textContent = 'Not on a repository page';
                        resetLinks();
                    }
                } else {
                    // Not on GitHub
                    statusElement.className = 'status inactive';
                    statusText.textContent = 'Not on GitHub';
                    resetLinks();
                }
            } else {
                statusElement.className = 'status inactive';
                statusText.textContent = 'Unable to check current page';
                resetLinks();
            }
        } catch (error) {
            console.error('Error checking status:', error);
            statusElement.className = 'status inactive';
            statusText.textContent = 'Error checking status';
            resetLinks();
        }
    }

    // Add a quick link to the current repository's DeepWiki page
    function addQuickLink(owner, repo) {
        const linksContainer = document.querySelector('.links');
        
        // Remove existing quick link if it exists
        const existingQuickLink = document.getElementById('quick-link');
        if (existingQuickLink) {
            existingQuickLink.remove();
        }

        // Hide the bottom links when we have a specific repo
        const bottomLinks = linksContainer.querySelector('.bottom-links');
        if (bottomLinks) {
            bottomLinks.style.display = 'none';
        }

        // Create new quick link
        const quickLink = document.createElement('a');
        quickLink.id = 'quick-link';
        quickLink.href = `https://deepwiki.com/${owner}/${repo}`;
        quickLink.target = '_blank';
        quickLink.className = 'link-btn primary';
        quickLink.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 6px;">
                <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 13.8H14.32c-.137-.22-.297-.439-.475-.659A14.075 14.075 0 0 0 12 11.24a14.12 14.12 0 0 0-1.845 1.9c-.178.22-.338.44-.475.66H6.432v-3.6h3.248c.137.22.297.439.475.659A14.075 14.075 0 0 0 12 12.76a14.12 14.12 0 0 0 1.845-1.9c.178-.22.338-.44.475-.66h3.248v3.6z"/>
            </svg>
            Open ${repo}
        `;
        quickLink.title = `Open ${owner}/${repo} in DeepWiki`;

        // Insert as the first button in the links container
        linksContainer.insertBefore(quickLink, linksContainer.firstChild);
    }

    // Reset links when not on a repository page
    function resetLinks() {
        // Remove existing quick link if it exists
        const existingQuickLink = document.getElementById('quick-link');
        if (existingQuickLink) {
            existingQuickLink.remove();
        }

        // Show the bottom links
        const linksContainer = document.querySelector('.links');
        const bottomLinks = linksContainer.querySelector('.bottom-links');
        if (bottomLinks) {
            bottomLinks.style.display = '';
        }
    }

    // Initialize status check
    checkStatus();

    // Listen for tab updates to refresh status
    if (chrome.tabs && chrome.tabs.onUpdated) {
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            if (changeInfo.status === 'complete') {
                checkStatus();
            }
        });
    }
}); 