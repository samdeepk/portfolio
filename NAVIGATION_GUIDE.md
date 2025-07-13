# Multi-Access Navigation Guide

This guide explains how each site can be accessed via both custom domains and URL parameters, providing maximum flexibility for users and developers.

## 🌐 Access Methods

### Method 1: Custom Domains (Production)
Each site has its own professional domain:

- **SRD Innovation Fund**: `https://srd.fund`
- **Sanskrut Corp**: `https://corp.sanskrut.in`
- **Sanskrut Enterprises**: `https://ent.sanskrut.in`
- **Sandeep Personal**: `https://sandeepkoduri.com`

### Method 2: URL Parameters (Universal)
Access any site from any domain using URL parameters:

- **SRD Innovation Fund**: `/?site=srd`
- **Sanskrut Corp**: `/?site=sanskrut-corp`
- **Sanskrut Enterprises**: `/?site=sanskrut-enterprises`
- **Sandeep Personal**: `/?site=sandeep`
- **Site Selector**: `/?site=selector` or `/` (default)

## 🔄 Navigation Examples

### From Any Domain:
\`\`\`
https://srd.fund/?site=sandeep          → Shows Sandeep's site on SRD domain
https://sandeepkoduri.com/?site=srd           → Shows SRD site on Sandeep's domain
https://localhost:3000/?site=srd        → Shows SRD site in development
\`\`\`

### Cross-Site Links:
\`\`\`
Current: https://srd.fund
Link to: /?site=sanskrut-corp           → Switches to Sanskrut Corp
Link to: https://corp.sanskrut.in       → Opens Sanskrut Corp in new tab
\`\`\`

## 🎯 Use Cases

### For Users:
- **Bookmarking**: Save specific sites with either domain or parameter
- **Sharing**: Share links that work regardless of current domain
- **Navigation**: Easy switching between related sites

### For Developers:
- **Testing**: Test any site configuration on localhost
- **Debugging**: Override domain routing with parameters
- **Development**: Work with any site without domain setup

### For SEO:
- **Canonical URLs**: Each site maintains its primary domain
- **Cross-linking**: Internal links preserve site context
- **Analytics**: Track usage across both access methods

## 🔧 Technical Implementation

### Priority System:
1. **URL Parameter** (highest priority)
2. **Custom Domain** (fallback)
3. **Default Selector** (localhost/development)

### URL Examples:
\`\`\`
https://srd.fund                        → SRD site (domain-based)
https://srd.fund/?site=sandeep          → Sandeep site (parameter override)
https://localhost:3000/?site=srd        → SRD site (parameter-based)
https://localhost:3000                  → Site selector (default)
\`\`\`

### Header Indicators:
- **Domain Badge**: Shows when accessed via custom domain
- **Parameter Badge**: Shows when accessed via URL parameter
- **Copy URL Button**: Easy sharing of current access method
- **Alternative Access**: Quick switch between domain/parameter

## 📱 User Interface Features

### Site Selector:
- Shows both access methods for each site
- Copy buttons for easy URL sharing
- Direct links to both domain and parameter versions

### Site Headers:
- Current access method indicator
- Copy current URL functionality
- Quick navigation to other sites
- Alternative access method toggle

### Cross-Site Navigation:
- Maintains current access method when possible
- Provides both internal and external links
- Preserves user's preferred navigation style

## 🚀 Benefits

### Flexibility:
- Works in any environment (dev, staging, production)
- No dependency on DNS configuration
- Easy A/B testing of different sites

### Professional Branding:
- Each site maintains its domain identity
- Clean URLs for marketing materials
- Professional email integration ready

### Development Friendly:
- No need to configure multiple local domains
- Easy testing of cross-site functionality
- Simple deployment across environments

### User Experience:
- Consistent navigation patterns
- Multiple ways to access content
- Shareable URLs that always work

## 🔍 SEO Considerations

### Canonical URLs:
- Each site's primary domain is the canonical version
- Parameter-based access includes canonical meta tags
- Search engines index the primary domain

### Internal Linking:
- Cross-site links use appropriate method
- Maintains link equity across the ecosystem
- Proper rel attributes for external links

### Analytics:
- Track both domain and parameter access
- Unified analytics across access methods
- User journey tracking across sites
