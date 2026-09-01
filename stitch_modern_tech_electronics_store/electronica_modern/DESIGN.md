---
name: Electronica Modern
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#434655'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e2dfde'
  on-secondary-container: '#636262'
  tertiary: '#943700'
  on-tertiary: '#ffffff'
  tertiary-container: '#bc4800'
  on-tertiary-container: '#ffede6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#ffdbcd'
  tertiary-fixed-dim: '#ffb596'
  on-tertiary-fixed: '#360f00'
  on-tertiary-fixed-variant: '#7d2d00'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max-width: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  section-padding: 80px
---

## Brand & Style

The design system is built upon a **Corporate / Modern** aesthetic, specifically tailored for a premium consumer electronics environment. The goal is to evoke a sense of precision, reliability, and technological sophistication while remaining highly accessible to the average consumer.

The visual direction emphasizes:
- **Clarity and Precision:** Leveraging ample whitespace to allow high-quality product photography to serve as the primary visual driver.
- **Technical Trust:** A disciplined application of a limited color palette to signify professional retail standards.
- **Modern Utility:** A focus on functional minimalism where every element serves a navigational or informational purpose, avoiding decorative clutter.

## Colors

The palette is anchored by a high-contrast foundation to ensure maximum readability and a "tech-forward" feel.

- **Primary (Electric Blue):** Used exclusively for primary actions (CTAs), focus states, and key brand accents. It signals interactivity and energy.
- **Secondary (Charcoal):** Applied to headings and primary body text to provide a grounded, high-end editorial feel without the harshness of pure black.
- **Neutral (Off-White):** The base background color provides a soft, non-glare canvas that makes product cards and white containers pop.
- **Borders:** Use a subtle light gray for structural definition in product grids and input fields to maintain a clean, organized layout.

## Typography

The design system utilizes **Inter** for its systematic, utilitarian, and highly legible qualities. 

- **Headings:** Use tight letter spacing and bold weights to create a strong visual hierarchy. Large display type is reserved for hero banners and category introductions.
- **Body:** Standardized at 16px for optimal readability on all devices. 
- **Labels:** Small caps or bold weights are used for "Trust Badges," price tags, and technical specifications to distinguish them from prose.
- **Mobile Scaling:** Headline sizes should scale down by roughly 10-15% on mobile devices to ensure titles do not break awkwardly.

## Layout & Spacing

The layout follows a **Fluid Grid** system within a max-width container to ensure the shop feels expansive yet controlled.

- **Grid:** Use a 12-column grid for desktop, 8-column for tablet, and 4-column for mobile.
- **Spacing Rhythm:** Adhere to an 8px base unit. Gaps between product cards in a grid should be 24px to provide enough breathing room for product titles and prices.
- **Sectioning:** Large vertical gaps (80px+) should be used between homepage sections (e.g., "New Arrivals" vs "Featured Categories") to reinforce a premium, uncluttered shopping experience.

## Elevation & Depth

This design system uses a combination of **Tonal Layers** and **Ambient Shadows** to create a structured hierarchy.

- **Surface Levels:** The main page background is `#FAFAFA`. Product cards and interactive containers use a pure `#FFFFFF` background to lift them visually.
- **Shadows:** Use a "Natural Ambient" shadow for cards: `0px 4px 20px rgba(0, 0, 0, 0.05)`. This creates a soft lift without looking heavy or dated.
- **Hover States:** Upon hover, elevations should increase slightly (`0px 8px 30px rgba(0, 0, 0, 0.08)`) to provide immediate tactile feedback.
- **Interactive Elements:** Buttons and inputs use low-contrast outlines (`1px solid #E5E7EB`) rather than heavy shadows to maintain a clean look.

## Shapes

The shape language is defined as **Rounded**, striking a balance between the technical precision of electronics and the approachability of a modern retailer.

- **Components:** Standard buttons, input fields, and small UI elements use a 0.5rem (8px) radius.
- **Cards:** Product and category cards use a larger `rounded-lg` (16px) radius to create a distinct, friendly container for imagery.
- **Selection States:** Checkboxes and radio buttons follow the same 4px-8px rounding logic to remain consistent with the primary action buttons.

## Components

- **Buttons:** Primary CTAs use the Electric Blue background with white text. Secondary buttons use a transparent background with a charcoal border. All buttons have a minimum height of 48px for touch-friendliness.
- **Product Cards:** Must include a white background, 16px corner radius, and a subtle shadow. Imagery should be centered with at least 16px of internal padding.
- **Input Fields:** Use a light gray border (#E5E7EB) that shifts to Electric Blue on focus. Labels should be placed above the field in `label-sm`.
- **Trust Badges:** Small, horizontal components using `label-md` typography, often paired with a simple monochromatic icon to communicate "Free Shipping" or "Secure Checkout."
- **Navigation:** A sticky top bar with a clean blur effect (backdrop-filter) to maintain context while scrolling. Use high-contrast charcoal for navigation links.
- **Chips/Tags:** Used for "In Stock" or "Sale" indicators. These should have a slight background tint of the status color (e.g., light green background for Success) and bold text.