# Conn-Unity Landing Page

A beautiful, modern landing page for the Conn-Unity community platform built with vanilla JavaScript, HTML, and CSS.

## 🚀 Features

- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Animated Statistics** - Counter animations for user engagement metrics
- **Smooth Scrolling** - Enhanced user experience with smooth scroll behavior
- **Modern UI/UX** - Clean, professional design with gradients and shadows
- **Performance Optimized** - Fast loading with minimal dependencies
- **Interactive Elements** - Hover effects, parallax scrolling, and smooth animations

## 📁 Project Structure

```
frontend/
├── index.html      # Main HTML file
├── styles.css      # All styling and animations
├── landing_page.js # JavaScript functionality (renamed from app.js)
├── logo.jpeg       # Brand logo image
└── README.md       # This file
```

## 🎨 Design Elements

- **Color Scheme**: Purple/Blue gradient theme (#5549FF, #7A6CFF)
- **Typography**: Inter for body text, Montserrat for headings
- **Components**:
  - Header with navigation
  - Hero section with floating card
  - Feature cards grid
  - Call-to-action section
  - Footer with links

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid, Flexbox, and custom properties
- **Vanilla JavaScript** - No frameworks, pure JS for maximum performance

## 🚀 Getting Started

### Option 1: Direct Open
Simply open `index.html` in your web browser:
```bash
open index.html
```

### Option 2: Local Server (Recommended)

Using Vite (Node.js):
```bash
npm install
npm run dev
```
Then visit the printed local URL (usually http://localhost:5173 or http://localhost:5174).

Using Python:
```bash
python3 -m http.server 8000
```
Then visit: http://localhost:8000

Using Node.js (with npx):
```bash
npx serve
```

Using VS Code:
- Install "Live Server" extension
- Right-click on `index.html` and select "Open with Live Server"

## ✨ Features Implemented

### JavaScript Functionality
- **Counter Animation** - Statistics animate from 0 to target values
- **Smooth Scrolling** - Anchor links scroll smoothly to sections
- **Intersection Observer** - Elements fade in when scrolled into view
- **Parallax Effects** - Background decorations move on scroll
- **Button Interactions** - Hover effects and click handlers
- **Lazy Loading** - Images load when needed (if implemented)
- **Responsive Handling** - Adapts to different screen sizes

### CSS Features
- **CSS Variables** - Easy theming and color management
- **Grid & Flexbox** - Modern layout techniques
- **Animations** - Fade-in effects and floating card animation
- **Gradients** - Beautiful background and button gradients
- **Box Shadows** - Depth and elevation effects
- **Media Queries** - Responsive breakpoints for all devices

## 📱 Responsive Breakpoints

- **Desktop**: 968px and above
- **Tablet**: 768px - 968px
- **Mobile**: Below 640px

## 🎯 Key Sections

1. **Header** - Logo and navigation buttons
2. **Hero Section** - Main CTA with animated stats and floating card
3. **Features** - Three feature cards explaining platform benefits
4. **CTA Section** - Secondary call-to-action
5. **Footer** - Community guidelines and links

## 🔧 Customization

### Change Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-color: #5549FF;
    --primary-dark: #4238E0;
    /* Add your colors here */
}
```

### Update Content
Edit text content in `index.html`

### Modify Animations
Adjust timing and effects in `landing_page.js` and `styles.css`

## 📊 Statistics

The landing page displays:
- 8.7K+ Active Users
- 65K+ Posts Shared
- 100K+ Conversations

These animate on page load for visual impact.

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 License

This project is created for Conn-Unity community platform.

## 👨‍💻 Development

To make changes:
1. Edit the HTML structure in `index.html`
2. Modify styles in `styles.css`
3. Add functionality in `landing_page.js`
4. Refresh your browser to see changes

## 🎨 Design Credits

Design inspired by modern SaaS landing pages with a focus on:
- Clean aesthetics
- User engagement
- Community building
- Meaningful interactions

---

Built with ❤️ for the Conn-Unity community
