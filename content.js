// DeepWiki GitHub Extension - Content Script
(function() {
    'use strict';

    // Function to check if we're on a GitHub repository page
    function isRepositoryPage() {
        const path = window.location.pathname;
        const pathSegments = path.split('/').filter(segment => segment.length > 0);
        
        // Check if we're on a repository page (github.com/owner/repo)
        return pathSegments.length >= 2 && 
               !pathSegments[0].startsWith('@') && // Not an organization with @
               !['marketplace', 'topics', 'collections', 'sponsors', 'about', 'pricing', 'team', 'enterprise', 'nonprofit', 'customer-stories', 'security', 'features', 'search', 'explore', 'issues', 'pull', 'discussions', 'notifications', 'settings', 'organizations', 'new', 'codespaces', 'github', 'orgs'].includes(pathSegments[0]);
    }

    // Function to extract owner and repo from current URL
    function getRepoInfo() {
        const path = window.location.pathname;
        const pathSegments = path.split('/').filter(segment => segment.length > 0);
        
        if (pathSegments.length >= 2) {
            return {
                owner: pathSegments[0],
                repo: pathSegments[1]
            };
        }
        return null;
    }

    // Function to create the DeepWiki button
    function createDeepWikiButton() {
        const repoInfo = getRepoInfo();
        if (!repoInfo) return null;

        const button = document.createElement('a');
        button.id = 'deepwiki-button';
        button.className = 'deepwiki-btn';
        button.href = `https://deepwiki.com/${repoInfo.owner}/${repoInfo.repo}`;
        button.target = '_blank';
        button.rel = 'noopener noreferrer';
        button.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 13.8H14.32c-.137-.22-.297-.439-.475-.659A14.075 14.075 0 0 0 12 11.24a14.12 14.12 0 0 0-1.845 1.9c-.178.22-.338.44-.475.66H6.432v-3.6h3.248c.137.22.297.439.475.659A14.075 14.075 0 0 0 12 12.76a14.12 14.12 0 0 0 1.845-1.9c.178-.22.338-.44.475-.66h3.248v3.6z"/>
            </svg>
            DeepWiki
        `;
        button.title = `Open in DeepWiki: ${repoInfo.owner}/${repoInfo.repo}`;
        
        return button;
    }

    // Function to insert the button into the page
    function insertButton() {
        // Remove existing button if it exists
        const existingButton = document.getElementById('deepwiki-button');
        if (existingButton) {
            existingButton.remove();
        }

        // Check if we're on a repository page
        if (!isRepositoryPage()) {
            return;
        }

        // Try to find the Watch button and insert DeepWiki button to its left
        const watchButtonSelectors = [
            // Modern GitHub layout - Watch button area
            '[data-testid="watch-button"]',
            '[data-test-selector="watch-button"]',
            'button[aria-label*="Watch"]',
            'button[aria-label*="watch"]',
            '.js-social-form button',
            // Alternative selectors for the action buttons area
            'div[data-view-component="true"] > div.d-flex > div:first-child',
            '.js-social-container',
            '.BtnGroup-item:first-child',
            // Broader container selectors
            'div.d-flex.flex-wrap.flex-items-center.mb-3 > div:first-child',
            'div[data-testid="repository-home-header"] div.d-flex.flex-wrap div:first-child'
        ];

        let watchButton = null;
        let insertionTarget = null;

        // Find the Watch button or its container
        for (const selector of watchButtonSelectors) {
            watchButton = document.querySelector(selector);
            if (watchButton) {
                // If we found the watch button, we want to insert before its parent container
                insertionTarget = watchButton.closest('.d-flex') || watchButton.parentElement;
                break;
            }
        }

        // Alternative approach: look for the action buttons container
        if (!insertionTarget) {
            const actionContainerSelectors = [
                // Repository action buttons container
                'div[data-testid="repository-home-header"] .d-flex.flex-wrap.flex-items-center.mb-3',
                '.repository-content .d-flex.flex-wrap.flex-items-center.mb-3',
                'div.d-flex.flex-wrap.flex-items-center.mb-3',
                // Legacy selectors
                '.js-social-container',
                '.social-count',
                '.pagehead-actions'
            ];

            for (const selector of actionContainerSelectors) {
                insertionTarget = document.querySelector(selector);
                if (insertionTarget) {
                    break;
                }
            }
        }

        if (insertionTarget) {
            const button = createDeepWikiButton();
            if (button) {
                // Create a container for our button that matches GitHub's button style
                const buttonContainer = document.createElement('div');
                buttonContainer.className = 'deepwiki-container';
                buttonContainer.style.display = 'inline-flex';
                buttonContainer.style.marginRight = '8px';
                buttonContainer.appendChild(button);
                
                // Insert the button at the beginning of the action buttons area
                insertionTarget.insertBefore(buttonContainer, insertionTarget.firstChild);
            }
        } else {
            // Fallback: try original selectors
            const fallbackSelectors = [
                'div[data-target="repository-details-container"] .BorderGrid-row .BorderGrid-cell:last-child',
                '.repository-content .d-flex.flex-wrap.flex-items-center.wb-break-word.f3.text-normal',
                'div[data-testid="repository-home-header"] .d-flex.flex-wrap.flex-items-center'
            ];

            let targetContainer = null;
            for (const selector of fallbackSelectors) {
                targetContainer = document.querySelector(selector);
                if (targetContainer) break;
            }

            if (targetContainer) {
                const button = createDeepWikiButton();
                if (button) {
                    const buttonContainer = document.createElement('div');
                    buttonContainer.className = 'deepwiki-container';
                    buttonContainer.appendChild(button);
                    targetContainer.appendChild(buttonContainer);
                }
            } else {
                // Last resort: fixed position in top right
                const button = createDeepWikiButton();
                if (button) {
                    const buttonContainer = document.createElement('div');
                    buttonContainer.className = 'deepwiki-container deepwiki-fallback';
                    buttonContainer.appendChild(button);
                    document.body.appendChild(buttonContainer);
                }
            }
        }
    }

    // Initialize the extension
    function init() {
        // Insert button on initial load
        insertButton();

        // Watch for navigation changes (GitHub uses pushState navigation)
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                // Delay to ensure the page has loaded
                setTimeout(insertButton, 1000);
            }
        }).observe(document, { subtree: true, childList: true });

        // Also listen for popstate events
        window.addEventListener('popstate', () => {
            setTimeout(insertButton, 500);
        });
    }

    // Wait for the page to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})(); 