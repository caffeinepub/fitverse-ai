# Specification

## Summary
**Goal:** Build FitVerse AI, a futuristic AI fashion e-commerce platform with glassmorphism UI, simulated AI body/wardrobe scanning, a virtual trial room, and a Motoko backend serving product data.

**Planned changes:**

### Design System
- Glassmorphism UI with frosted glass cards, soft purple/neon blue/pink gradient palette, animated gradient mesh background on all pages
- Futuristic clean sans-serif typography with gradient text accents
- All buttons have floating glow effects and scale/glow micro-animations on hover
- Smooth fade/slide page transitions

### Navigation
- Floating animated sidebar on all pages (except landing hero) with links to: Landing, Shop, Trial Hub, Body Scan AI, Wardrobe AI
- Neon glow on hover per nav item, glowing active page indicator
- Sidebar collapses to icons on narrow viewports

### Landing Page
- Hero headline "Shop Smart. Try Smart. Dress Smart." with gradient text
- Subheadline describing AI-powered trial hub, body scan, and wardrobe intelligence
- Three CTA buttons: "Start Shopping" → Shop, "Scan My Body" → Body Scan AI, "Scan My Wardrobe" → Wardrobe AI
- Animated digital avatar illustration (continuous CSS/JS animation)

### Shop Page
- Product grid with at least 10 mock products across T-shirts, Jeans, Tops, Kurtas, Dresses categories (fetched from backend)
- Each card: product image, name, price, size selector (XS/S/M/L/XL), AI Fit Confidence % badge, "Add to Trial" button
- Trial cart limited to 5 items max; remaining "Add to Trial" buttons disabled after limit reached
- Dynamic Trial Cart side panel with real-time updates and "Send to Trial Hub" button (navigates to Trial Hub)
- Size mismatch warning popup if body scan is complete and selected size doesn't match recommended size
- Duplicate wardrobe ownership popup if wardrobe scan is complete and a similar item is detected

### Trial Hub Page
- Displays up to 5 selected trial items (image + selected size)
- "Keep" button: green highlight + "Purchased" label + confirmation animation
- "Return" button: red highlight + "Returned" label + confirmation animation
- Buttons disabled after decision made per item; state persists across session navigation

### Body Scan AI Page
- Simulated camera UI frame with animated pulsing scan line/ring overlay
- "Start Scan" button triggers 2-3 second scan animation
- Post-scan: measurement cards for Shoulder, Chest, Waist, Height (mock values)
- Recommended size result card: "Your Ideal Size: M"
- Stores recommended size in global app state

### Wardrobe AI Page
- Simulated wardrobe scanning interface (animated camera frame or upload zone)
- After scan trigger: analytics dashboard with tops count, jeans count, and color distribution chart (bar or donut, 4-5 colors, mock data)
- Stores wardrobe analytics data in global app state

### Global State
- React Context storing: trial cart items (max 5), body scan recommended size, wardrobe analytics data
- State accessible across Shop, Trial Hub, Body Scan AI, and Wardrobe AI pages throughout the session

### Backend (Motoko)
- Actor storing at least 10 mock products (name, category, price, sizes array, fitConfidence %)
- Exposes `getProducts()` query function
- Shop page fetches and renders products from backend on load

**User-visible outcome:** Users can browse AI-scored fashion products, simulate a body scan to get size recommendations, simulate a wardrobe scan to view analytics, add up to 5 items to a virtual trial cart with smart fit/ownership warnings, and make keep/return decisions in the Trial Hub — all within a premium futuristic glassmorphism UI.
