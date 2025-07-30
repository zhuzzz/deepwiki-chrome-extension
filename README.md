# DeepWiki Chrome Extension

A Chrome extension that adds a convenient "DeepWiki" button to GitHub repository pages, allowing you to quickly navigate to the corresponding DeepWiki documentation page.

## Features

- 🔗 **Quick Navigation**: Adds a "DeepWiki" button to GitHub repository pages
- 🎨 **Beautiful Design**: Integrates seamlessly with GitHub's interface
- ⚡ **Fast & Lightweight**: Minimal performance impact
- 🌙 **Dark Mode Support**: Works with GitHub's dark theme
- 📱 **Responsive**: Optimized for different screen sizes

## How it Works

When you visit a GitHub repository page (e.g., `https://github.com/bytedance/flowgram.ai`), the extension automatically adds a "DeepWiki" button. Clicking this button will redirect you to the corresponding DeepWiki page (`https://deepwiki.com/bytedance/flowgram.ai`).

## Installation

### Method 1: Load as Unpacked Extension (Development)

1. **Download or Clone** this repository to your local machine
2. **Open Chrome** and navigate to `chrome://extensions/`
3. **Enable Developer Mode** by toggling the switch in the top-right corner
4. **Click "Load unpacked"** and select the folder containing the extension files
5. **The extension** should now appear in your extensions list and toolbar

### Method 2: From Chrome Web Store (Coming Soon)

The extension will be available on the Chrome Web Store once reviewed and approved.

## Files Structure

```
deepwiki-chrome-extension/
├── manifest.json         # Extension configuration (Manifest V3)
├── content.js           # Script injected into GitHub pages
├── styles.css           # CSS styles for the DeepWiki button
├── popup.html           # Extension popup interface
├── popup.js             # Popup functionality
├── icons/               # Extension icons
│   ├── icon16.png       # 16x16 icon
│   ├── icon48.png       # 48x48 icon
│   └── icon128.png      # 128x128 icon
└── README.md            # This file
```

## Technical Details

- **Manifest Version**: 3 (latest Chrome extension standard)
- **Permissions**: `activeTab` (minimal permissions for security)
- **Target Sites**: `https://github.com/*/*` (GitHub repository pages only)
- **Framework**: Vanilla JavaScript (no dependencies)

## Features Breakdown

### Content Script (`content.js`)
- Detects GitHub repository pages automatically
- Intelligently finds the best location to insert the button
- Handles GitHub's dynamic navigation (single-page app behavior)
- Extracts owner and repository name from URLs

### Styling (`styles.css`)
- Modern gradient button design
- Hover and focus effects
- Responsive design for mobile devices
- Dark mode compatibility
- Integration with GitHub's existing button styles

### Popup Interface (`popup.html` + `popup.js`)
- Shows extension status
- Provides quick access to DeepWiki
- Displays current repository information when applicable

## Usage

1. **Navigate** to any GitHub repository page
2. **Look for** the purple "DeepWiki" button (usually near the repository actions)
3. **Click** the button to open the repository in DeepWiki
4. **Alternatively**, click the extension icon in the toolbar for more options

## Browser Compatibility

- **Chrome**: Version 88+ (Manifest V3 support)
- **Edge**: Version 88+ (Chromium-based)
- **Other Chromium browsers**: Should work with recent versions

## Development

If you want to modify or contribute to this extension:

1. **Clone** the repository
2. **Make changes** to the relevant files
3. **Reload** the extension in `chrome://extensions/` to test changes
4. **Test** on various GitHub repository pages

### Icon Requirements

The extension requires icon files in the `icons/` directory:
- `icon16.png`: 16×16 pixels (toolbar icon)
- `icon48.png`: 48×48 pixels (extension management page)
- `icon128.png`: 128×128 pixels (Chrome Web Store)

Replace the placeholder files with actual PNG icons before publishing.

## Privacy & Security

- **Minimal Permissions**: Only requests access to the current active tab
- **Limited Data Collection**: Collects anonymous usage analytics to improve functionality
- **No Personal Data**: No personal information, browsing history, or repository content is collected
- **Open Source**: All code is visible and auditable
- **Secure**: Follows Chrome extension security best practices

### Data Collection Notice
This extension uses Google Analytics to collect anonymous usage data including:
- Extension popup open/close events
- Button click interactions
- General usage patterns

**No personal information, repository content, or browsing history is collected.**

## Troubleshooting

### Button Not Appearing
- Make sure you're on a GitHub repository page (not user profiles, search, etc.)
- Try refreshing the page
- Check if the extension is enabled in `chrome://extensions/`

### Button in Wrong Location
- GitHub's layout changes may affect button placement
- The extension includes multiple fallback positions

### Extension Not Working
- Ensure you're using a compatible Chrome version (88+)
- Check the browser console for any error messages
- Try disabling and re-enabling the extension

## Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have suggestions:

- **Open an issue** on GitHub
- **Check existing issues** for similar problems
- **Provide details** about your browser version and the specific issue

---

**Happy browsing with DeepWiki! 🚀**
