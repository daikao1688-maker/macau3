# 🎰 CasinoPro Premium Theme - Installation Guide

**Version:** 1.0.0  
**Framework:** Astro 7.x + React 18  
**License:** Single Site License  
**Support:** Email support included

---

## 📋 Table of Contents

1. [Requirements](#requirements)
2. [Quick Start](#quick-start)
3. [Installation Steps](#installation-steps)
4. [Configuration](#configuration)
5. [Customization](#customization)
6. [Deployment](#deployment)
7. [Features Overview](#features-overview)
8. [Troubleshooting](#troubleshooting)
9. [Support](#support)

---

## 🔧 Requirements

### System Requirements:
- **Node.js:** 22.12.0 or higher
- **npm:** 9.0.0 or higher (or yarn/pnpm)
- **Operating System:** Windows, macOS, or Linux
- **RAM:** Minimum 4GB
- **Disk Space:** 500MB free space

### Technical Knowledge:
- Basic understanding of HTML/CSS
- Familiarity with command line/terminal
- Basic JavaScript knowledge (for customization)

---

## ⚡ Quick Start

```bash
# 1. Extract the ZIP file
unzip CasinoPro-Premium-Theme-v1.0.0.zip
cd CasinoPro-Premium-Theme

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser
# Visit: http://localhost:4321
```

**That's it!** Your theme is now running locally.

---

## 📦 Installation Steps

### Step 1: Extract Files

Extract the ZIP file to your desired location:

```bash
# Windows
Right-click → Extract All → Choose location

# macOS
Double-click the ZIP file

# Linux
unzip CasinoPro-Premium-Theme-v1.0.0.zip
```

### Step 2: Navigate to Directory

```bash
cd CasinoPro-Premium-Theme
```

### Step 3: Install Dependencies

Choose your preferred package manager:

**Using npm (recommended):**
```bash
npm install
```

**Using yarn:**
```bash
yarn install
```

**Using pnpm:**
```bash
pnpm install
```

**Installation time:** 2-5 minutes depending on your internet speed.

### Step 4: Start Development Server

```bash
npm run dev
```

**Output:**
```
🚀 astro v7.x.x started in XXXms

  ┃ Local    http://localhost:4321/
  ┃ Network  use --host to expose
```

### Step 5: Open in Browser

Open your browser and visit: **http://localhost:4321**

You should see the CasinoPro homepage! 🎉

---

## ⚙️ Configuration

### Basic Configuration

#### 1. Site Information

Edit `astro.config.mjs`:

```javascript
export default defineConfig({
  site: 'https://your-domain.com', // Your domain
  base: '/', // Base path (leave as '/' for root)
  // ... other settings
});
```

#### 2. Meta Information

Edit `src/layouts/Layout.astro`:

```astro
---
const { title = 'Your Casino Name' } = Astro.props;
const description = 'Your casino description';
const keywords = 'your, keywords, here';
---
```

#### 3. Brand Colors

Edit `tailwind.config.mjs`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#3B82F6', // Change to your brand color
        600: '#2563EB',
        // ...
      }
    }
  }
}
```

### Advanced Configuration

#### PWA Settings

Edit `astro.config.mjs`:

```javascript
pwa({
  manifest: {
    name: 'Your Casino Name',
    short_name: 'YourCasino',
    description: 'Your description',
    theme_color: '#0F172A',
    background_color: '#0F172A',
    // ...
  }
})
```

#### SEO Settings

Edit individual page files to customize:
- Page titles
- Meta descriptions
- Open Graph tags
- Twitter Card tags

---

## 🎨 Customization

### 1. Logo & Branding

**Replace Logo:**
```
public/logo.svg          → Your logo (SVG recommended)
public/logo-light.svg    → Light version (optional)
public/favicon.svg       → Favicon
```

**Update in code:**
```astro
<!-- src/components/Header.astro -->
<img src="/logo.svg" alt="Your Casino" />
```

### 2. Colors & Theme

**Primary Colors:**
Edit `tailwind.config.mjs` → `theme.extend.colors`

**Dark Mode:**
Already configured! Uses `dark:` prefix in Tailwind.

### 3. Content

#### Homepage Hero:
```astro
<!-- src/components/Hero.astro -->
<h1>Your Headline</h1>
<p>Your tagline</p>
```

#### Games Data:
```typescript
// src/data/games.ts
export const games: Game[] = [
  {
    id: 'your-game',
    title: 'Your Game Title',
    // ... customize game data
  }
];
```

#### Promotions:
```astro
<!-- src/components/Promotions.astro -->
<!-- Edit promotion cards -->
```

### 4. Pages

**Add New Page:**
```bash
# Create new file
src/pages/your-page.astro
```

```astro
---
import Layout from '../layouts/Layout.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
---

<Layout title="Your Page Title">
  <Header />
  <main>
    <!-- Your content -->
  </main>
  <Footer />
</Layout>
```

**Update Navigation:**
```astro
<!-- src/components/Header.astro -->
<a href="/your-page">Your Page</a>
```

### 5. Demo Games

**Customize Demo Themes:**
```typescript
// src/data/demoThemes.ts
export const gameDemoThemes: Record<string, DemoTheme> = {
  'your-game-id': {
    primaryColor: '#HEX',
    symbols: ['🎰', '💎', ...],
    atmosphere: 'modern',
    // ... customize theme
  }
};
```

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

**Output:** `dist/` folder with static files.

### Deployment Options

#### 1. Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

**Or use Vercel Dashboard:**
1. Go to https://vercel.com
2. Import Git repository
3. Deploy automatically

#### 2. Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy

# Production
netlify deploy --prod
```

**Or use Netlify Dashboard:**
1. Drag & drop `dist/` folder
2. Or connect Git repository

#### 3. GitHub Pages

This project includes `.github/workflows/deploy.yml`.

1. Push the repository to GitHub.
2. In GitHub, set Pages source to **GitHub Actions**.
3. Push to `main`; the workflow installs dependencies, builds Astro, and deploys `dist/`.

Default Pages URL: `https://daikao1688-maker.github.io/macau3/`

#### 4. Traditional Hosting

1. Build: `npm run build`
2. Upload `dist/` folder contents to your server
3. Point domain to uploaded files

### Environment Variables

Create `.env` file for sensitive data:

```env
PUBLIC_SITE_URL=https://your-domain.com
PUBLIC_API_URL=https://api.your-domain.com
# Add your variables
```

**Note:** Prefix with `PUBLIC_` to expose to client-side.

---

## 🎯 Features Overview

### Core Features

✅ **26 Pages** - Complete casino website structure  
✅ **Responsive Design** - Mobile, tablet, desktop optimized  
✅ **PWA Ready** - Installable as app  
✅ **SEO Optimized** - Meta tags, semantic HTML  
✅ **Fast Performance** - Astro static generation  
✅ **Modern UI** - Tailwind CSS, glassmorphism  
✅ **Dark Mode** - Built-in dark theme  

### Interactive Features

✅ **Game Search** - Real-time search with filters  
✅ **Game Filters** - Category, provider, features  
✅ **Demo Games** - 4 types (Slots, Roulette, Blackjack, Live Casino)  
✅ **Unique Themes** - 13+ game-specific themes  
✅ **Live Activity** - Real-time activity feed  
✅ **Jackpot Counter** - Animated jackpot display  
✅ **Game Detail Modal** - Comprehensive game info  

### Pages Included

**Main Pages:**
- Homepage
- Games (All Games)
- Slots
- Table Games
- Live Casino (Enhanced)
- Jackpots (Enhanced)
- New Games
- Providers

**User Pages:**
- Account Dashboard
- Login
- Sign Up
- Forgot Password

**Promotional:**
- Promotions
- Tournaments
- VIP Program

**Legal & Info:**
- About Us
- Contact Us
- Help Center
- FAQ
- Terms & Conditions
- Privacy Policy
- Cookie Policy
- Responsible Gaming
- Licenses
- Payment Methods

**Utility:**
- 404 Error Page
- Offline Page (PWA)

---

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start dev server (port 4321)
npm run dev -- --host    # Expose to network

# Build
npm run build            # Build for production
npm run preview          # Preview production build

# Maintenance
npm run astro check      # Check for errors
npm run astro sync       # Sync types
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Port Already in Use

**Error:** `Port 4321 is already in use`

**Solution:**
```bash
# Use different port
npm run dev -- --port 3000
```

#### 2. Module Not Found

**Error:** `Cannot find module 'X'`

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### 3. Build Errors

**Error:** Build fails with TypeScript errors

**Solution:**
```bash
# Check for errors
npm run astro check

# Sync types
npm run astro sync
```

#### 4. Styles Not Loading

**Error:** Tailwind styles not applied

**Solution:**
```bash
# Rebuild
npm run build

# Clear cache
rm -rf .astro dist
npm run dev
```

#### 5. Images Not Loading

**Error:** Images return 404

**Solution:**
- Check file paths (case-sensitive)
- Ensure images are in `public/` folder
- Use `/image.jpg` not `./image.jpg`

### Getting Help

If you encounter issues:

1. **Check Documentation** - Read this guide thoroughly
2. **Check Console** - Look for error messages in browser console
3. **Check Terminal** - Look for build errors in terminal
4. **Search Issues** - Common problems have known solutions
5. **Contact Support** - Email us (see Support section)

---

## 📚 Additional Resources

### Astro Documentation
- Official Docs: https://docs.astro.build
- Astro Discord: https://astro.build/chat

### Tailwind CSS
- Documentation: https://tailwindcss.com/docs
- Playground: https://play.tailwindcss.com

### React
- Documentation: https://react.dev
- Learn React: https://react.dev/learn

### Deployment Guides
- Vercel: https://vercel.com/docs
- Netlify: https://docs.netlify.com
- GitHub Pages: https://pages.github.com

---

## 🎓 Best Practices

### Development

1. **Use Git** - Version control your changes
2. **Test Locally** - Always test before deploying
3. **Backup** - Keep backups of customizations
4. **Document** - Comment your custom code
5. **Update** - Keep dependencies updated

### Performance

1. **Optimize Images** - Use WebP format, compress images
2. **Lazy Load** - Images load on scroll (already implemented)
3. **Minimize JS** - Keep JavaScript minimal
4. **Cache** - Use CDN and browser caching
5. **Monitor** - Use Lighthouse for performance checks

### Security

1. **HTTPS** - Always use HTTPS in production
2. **Environment Variables** - Never commit sensitive data
3. **Dependencies** - Keep packages updated
4. **Validation** - Validate all user inputs
5. **Headers** - Set security headers

---

## 💼 License & Usage

### Single Site License

This theme is licensed for **one website/domain only**.

**Allowed:**
✅ Use on one website  
✅ Modify code and design  
✅ Use for client project (one site)  
✅ Create derivative work  

**Not Allowed:**
❌ Resell or redistribute theme  
❌ Use on multiple sites (requires additional licenses)  
❌ Share with others  
❌ Create competing product  

### Extended License

For multiple sites, contact us for extended licensing options.

---

## 📞 Support

### Email Support

**Email:** support@casinopro-theme.com  
**Response Time:** Within 24-48 hours  
**Support Period:** 6 months from purchase  

### What's Included

✅ Installation assistance  
✅ Bug fixes  
✅ Configuration help  
✅ Customization guidance  
✅ Deployment support  

### What's Not Included

❌ Custom development  
❌ Third-party plugin support  
❌ Server configuration  
❌ Content creation  
❌ SEO services  

### Before Contacting Support

Please provide:
1. **Theme Version** - Check package.json
2. **Node Version** - Run `node --version`
3. **Error Message** - Full error text
4. **Steps to Reproduce** - What you did
5. **Screenshots** - If applicable

---

## 🎉 Thank You!

Thank you for purchasing **CasinoPro Premium Theme**!

We hope you enjoy using this theme and create an amazing casino website.

**Happy Building!** 🚀

---

## 📝 Changelog

### Version 1.0.0 (May 2026)
- Initial release
- 28 complete pages
- 4 demo game types
- 13 unique game themes
- PWA support
- SEO optimized
- Fully responsive
- Modern design

---

## 🔗 Quick Links

- **Documentation:** This file
- **Demo:** https://casino-premium-theme.vercel.app
- **Support:** support@casinopro-theme.com
- **Updates:** Check email for update notifications

---

**CasinoPro Premium Theme v1.0.0**  
**© 2026 - All Rights Reserved**
