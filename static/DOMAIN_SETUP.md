# Custom Domain Setup Guide

This guide explains how to set up custom domains for each site in the portfolio ecosystem.

## Domain Configuration

### 1. SRD Innovation Fund - `srd.fund`
- **Purpose**: Investment portfolio and startup showcase
- **Primary Color**: Blue (#3B82F6)
- **Features**: Investment timeline, portfolio metrics, project details

### 2. Sanskrut Corp - `sanskrutcorp.com`
- **Purpose**: Incubation platform and early-stage ventures
- **Primary Color**: Green (#10B981)
- **Features**: Project timeline, incubation metrics, status tracking

### 3. Sanskrut Enterprises - `sanskrutenterprises.com`
- **Purpose**: Hospitality and real estate portfolio
- **Primary Color**: Purple (#8B5CF6)
- **Features**: Property portfolio, location mapping, ownership details

### 4. Sandeep Personal - `sandeep.com`
- **Purpose**: Personal portfolio and professional timeline
- **Primary Color**: Orange (#F97316)
- **Features**: Career timeline, cross-company integration, contact information

## DNS Setup Instructions

### For Vercel Deployment:

1. **Add Custom Domains in Vercel Dashboard:**
   \`\`\`
   srd.fund
   www.srd.fund
   sanskrutcorp.com
   www.sanskrutcorp.com
   sanskrutenterprises.com
   www.sanskrutenterprises.com
   sandeep.com
   www.sandeep.com
   \`\`\`

2. **DNS Records (Add to your domain registrar):**
   \`\`\`
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com

   Type: CNAME  
   Name: www
   Value: cname.vercel-dns.com
   \`\`\`

### For Other Hosting Providers:

1. **Point A Records to your server IP:**
   \`\`\`
   Type: A
   Name: @
   Value: [YOUR_SERVER_IP]

   Type: A
   Name: www
   Value: [YOUR_SERVER_IP]
   \`\`\`

## Environment Variables

Set these environment variables for production:

\`\`\`env
NEXT_PUBLIC_DOMAIN_SRD=srd.fund
NEXT_PUBLIC_DOMAIN_SANSKRUT_CORP=sanskrutcorp.com
NEXT_PUBLIC_DOMAIN_SANSKRUT_ENTERPRISES=sanskrutenterprises.com
NEXT_PUBLIC_DOMAIN_SANDEEP=sandeep.com
\`\`\`

## SSL Certificates

- Vercel automatically provides SSL certificates for custom domains
- For other providers, ensure SSL certificates are configured for all domains

## Testing

1. **Local Development:**
   - Use `localhost:3000` to access the site selector
   - Use `localhost:3000/?site=srd` to test individual sites

2. **Production Testing:**
   - Verify each domain loads the correct site
   - Test cross-domain navigation
   - Verify SEO meta tags are domain-specific

## Features by Domain

### Automatic Domain Detection
- Middleware automatically detects the domain and loads the appropriate site
- No manual site selection needed when accessing via custom domains

### Cross-Site Navigation
- Header includes links to other domains (when not on localhost)
- Maintains ecosystem connectivity while preserving domain identity

### SEO Optimization
- Domain-specific meta tags and Open Graph images
- Unique sitemaps for each domain
- Custom favicons and branding per domain

### Analytics Tracking
- Each domain can have separate analytics tracking
- Unified dashboard available for cross-site metrics

## Maintenance

### Adding New Domains:
1. Update `lib/domain-config.ts`
2. Add DNS records
3. Configure in hosting provider
4. Update `next.config.mjs` if needed

### Updating Site Content:
- Content changes automatically reflect across all domains
- Domain-specific styling maintained through CSS variables
