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
    function insertDeepWikiButton() {
        // Remove any existing buttons first
        const existingButtons = document.querySelectorAll('.deepwiki-container');
        existingButtons.forEach(btn => btn.remove());

        const repoInfo = getRepoInfo();
        if (!repoInfo) return;

        console.log('Repository info:', repoInfo);

        let insertionTarget = null;
        let insertionMethod = 'append';

        // First try to find the visible breadcrumb elements
        const visibleBreadcrumbSelectors = [
            '.AppHeader-context-item:not([tabindex="-1"])', // Visible breadcrumb items only
            '.AppHeader-context-item-label'
        ];

        for (const selector of visibleBreadcrumbSelectors) {
            const breadcrumbItems = document.querySelectorAll(selector);
            console.log(`Found ${breadcrumbItems.length} items with selector: ${selector}`);
            
            for (let i = 0; i < breadcrumbItems.length; i++) {
                const item = breadcrumbItems[i];
                const text = item.textContent.trim();
                console.log(`Visible breadcrumb item ${i}:`, text, item);
                
                // Look for the repository name
                if (text === repoInfo.repo || text.includes(repoInfo.repo)) {
                    console.log('Found repo name in visible breadcrumb:', text);
                    insertionTarget = item;
                    insertionMethod = 'after';
                    break;
                }
            }
            
            if (insertionTarget) break;
        }

        // If we didn't find the repo name in visible breadcrumbs, 
        // look for the last visible breadcrumb item (which should be after the separator)
        if (!insertionTarget) {
            const lastVisibleItem = document.querySelector('.AppHeader-context-item:not([tabindex="-1"]):last-of-type');
            if (lastVisibleItem && lastVisibleItem.textContent.trim() === repoInfo.owner) {
                console.log('Using owner breadcrumb as insertion point');
                insertionTarget = lastVisibleItem;
                insertionMethod = 'after';
            }
        }

        // Fallback: try main repo page selectors
        if (!insertionTarget) {
            console.log('Trying fallback selectors');
            const mainPageSelectors = [
                'h1[data-testid="repository-name-heading"]',
                'h1.public strong a',
                'h1 strong a[data-pjax="#repo-content-pjax-container"]'
            ];

            for (const selector of mainPageSelectors) {
                const element = document.querySelector(selector);
                if (element) {
                    console.log('Found fallback element with selector:', selector);
                    insertionTarget = element.parentElement;
                    insertionMethod = 'append';
                    break;
                }
            }
        }

        if (insertionTarget) {
            console.log('Final insertion target:', insertionTarget);
            console.log('Final insertion method:', insertionMethod);
            
            const button = createDeepWikiButton();
            if (button) {
                const buttonContainer = document.createElement('div');
                buttonContainer.className = 'deepwiki-container deepwiki-header';
                buttonContainer.appendChild(button);
                
                if (insertionMethod === 'after') {
                    insertionTarget.parentElement.insertBefore(buttonContainer, insertionTarget.nextSibling);
                    console.log('Inserted button AFTER target element');
                } else {
                    insertionTarget.appendChild(buttonContainer);
                    console.log('Appended button TO target element');
                }
                
                console.log('DeepWiki button inserted successfully');
            }
        } else {
            console.log('No suitable insertion target found');
        }
    }

    // Initialize the extension
    function init() {
        // Insert button on initial load
        insertDeepWikiButton();

        // Watch for navigation changes (GitHub uses pushState navigation)
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                // Delay to ensure the page has loaded
                setTimeout(insertDeepWikiButton, 1000);
            }
        }).observe(document, { subtree: true, childList: true });

        // Also listen for popstate events
        window.addEventListener('popstate', () => {
            setTimeout(insertDeepWikiButton, 500);
        });
    }

    // Wait for the page to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})(); 
