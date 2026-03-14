# 🎨 CoreInventory Design Tokens & Color Guide

## Color Palette

### Primary Gradient
```
From: #2563eb (Blue-600)
To:   #06b6d4 (Cyan-600)

Usage: Buttons, headings, key elements
Example: bg-gradient-to-r from-blue-600 to-cyan-600
```

### Background Colors
```
Primary:      #f8fafc (Slate-50)  - Main page background
Secondary:    #ffffff (White)     - Cards, containers
Tertiary:     #f0f9ff (Blue-50)   - Info boxes
Accent:       #f0fdfa (Cyan-50)   - Subtle backgrounds
```

### Text Colors
```
Primary:      #0f172a (Slate-900) - Main text, headings
Secondary:    #475569 (Slate-600) - Body text, labels
Tertiary:     #64748b (Slate-500) - Placeholder text
Light:        #f1f5f9 (Slate-100) - Light text
```

### State Colors
```
Error:        #dc2626 (Red-600)   - Errors, alerts
Success:      #10b981 (Emerald-600) - Success messages
Warning:      #f59e0b (Amber-500) - Warnings
Info:         #3b82f6 (Blue-500)  - Information
```

### Border & Shadow
```
Border Light: #e2e8f0 (Slate-200)
Border Dark:  #cbd5e1 (Slate-300)
Shadow:       rgba(0,0,0,0.1)     - Light, subtle shadows
```

---

## Typography Scale

### Headings
```
H1: text-5xl md:text-6xl font-bold text-slate-900
    - Landing hero: "Smart Inventory Management Made Easy"

H2: text-4xl md:text-5xl font-bold text-slate-900
    - Section headers: "Powerful Features"

H3: text-2xl md:text-3xl font-bold text-slate-900
    - Card titles: "Create Account"

H4: text-lg font-semibold text-slate-900
    - Form labels: "Username or Email"
```

### Body Text
```
Large:  text-lg text-slate-600
Normal: text-base text-slate-600
Small:  text-sm text-slate-600
Tiny:   text-xs text-slate-600
```

### Special
```
Accent:   font-semibold text-blue-600
Muted:    text-slate-400
```

---

## Component Styles

### Buttons

#### Primary Button
```css
bg-gradient-to-r from-blue-600 to-cyan-600
text-white
px-8 py-4
font-semibold
rounded-lg
hover:shadow-lg hover:from-blue-700 hover:to-cyan-700
transition
```

#### Secondary Button
```css
border-2 border-slate-200
text-slate-700
px-8 py-4
font-semibold
rounded-lg
hover:bg-slate-50 hover:border-slate-300
transition
```

#### Outlined Button
```css
border-2 border-slate-300
text-slate-700
px-6 py-3
font-medium
rounded-lg
hover:bg-slate-50
```

### Input Fields

#### Base Input
```css
px-4 py-3
bg-slate-50
border border-slate-300
rounded-lg
text-slate-900
placeholder-slate-400
transition
```

#### Focus State
```css
focus:outline-none
focus:border-blue-500
focus:ring-2 focus:ring-blue-200
```

#### Error State
```css
border-red-300
focus:border-red-500
focus:ring-red-200
```

### Cards & Containers

#### Main Card
```css
bg-white/80
backdrop-blur-xl
border border-slate-200/50
rounded-2xl
shadow-xl
p-8
```

#### Feature Card
```css
p-8
rounded-xl
border border-slate-200
hover:border-blue-300
hover:shadow-lg
hover:bg-blue-50/30
transition
```

### Badges & Tags

#### Info Badge
```css
px-3 py-1
bg-blue-50
rounded-full
border border-blue-200
text-sm text-blue-700
font-medium
```

#### Success Badge
```css
px-3 py-1
bg-emerald-50
rounded-full
border border-emerald-200
text-sm text-emerald-700
font-medium
```

---

## Spacing Scale

```
xs: 0.25rem (4px)
sm: 0.5rem  (8px)
md: 1rem    (16px)
lg: 1.5rem  (24px)
xl: 2rem    (32px)
2xl: 2.5rem (40px)
3xl: 3rem   (48px)
```

### Common Patterns
```
Form spacing:     gap-5  (1.25rem)
Card padding:     p-8    (2rem)
Section margin:   py-20  (5rem)
Component gap:    gap-3  (0.75rem)
```

---

## Shadow Hierarchy

```
Light:   shadow-sm   - Subtle depth
Default: shadow-lg   - Standard cards
Heavy:   shadow-2xl  - Hero sections
None:    shadow-none - Flat elements
```

---

## Transitions & Animations

### Duration
```
Fast:    transition-colors duration-200
Normal:  transition duration-300
Slow:    transition duration-500
```

### Common Effects
```
Hover Shadow:    hover:shadow-lg
Hover Scale:     hover:scale-105
Hover Color:     hover:text-slate-900
Opacity:         hover:opacity-80
```

---

## Icons

### Lucide React Icons Used
```
Landing Page:
  Boxes          - Logo/branding
  CheckCircle2   - Features, checkmarks
  Zap            - Lightning fast
  BarChart3      - Analytics
  Lock           - Security
  Users          - Collaboration
  Headphones     - Support
  ArrowRight     - Navigation

Login/Register:
  Mail           - Email input
  Lock           - Password input
  User           - Name/username
  Eye            - Show password
  EyeOff         - Hide password
  Check          - Success state
  Boxes          - Logo
  ArrowRight     - Navigation
```

### Icon Sizing
```
Header:    w-7 h-7  (28px)
Standard:  w-6 h-6  (24px)
Input:     w-5 h-5  (20px)
Small:     w-4 h-4  (16px)
```

---

## Responsive Breakpoints

### Tailwind Breakpoints
```
sm:  640px   - Small devices
md:  768px   - Tablets
lg:  1024px  - Desktops
xl:  1280px  - Large screens
2xl: 1536px  - Extra large screens
```

### Grid Patterns
```
Mobile:   grid-cols-1
Tablet:   md:grid-cols-2
Desktop:  md:grid-cols-3 lg:grid-cols-4
```

---

## Glassmorphism Effects

### Backdrop Blur
```
backdrop-blur-xl
  - Creates frosted glass effect
  - Used on: Cards, navigation
  - Opacity: white/80
```

### Example
```jsx
<div className="bg-white/80 backdrop-blur-xl border border-slate-200/50">
  {/* Content */}
</div>
```

---

## Gradient Patterns

### Primary Gradient (Blue to Cyan)
```css
background: linear-gradient(
  to right,
  #2563eb,
  #06b6d4
);
```

### Background Gradients
```css
/* Page background */
from-slate-50 via-white to-blue-50

/* Blur circles */
bg-blue-100/50 rounded-full blur-3xl
bg-cyan-100/50 rounded-full blur-3xl
```

---

## Accessibility

### Color Contrast Ratios
```
Dark text on light background:   ✅ 8.5:1 (AAA)
Light text on dark background:   ✅ 7:1 (AAA)
Blue buttons on white:           ✅ 4.5:1 (AA)
```

### Focus Indicators
```
Visible ring:    focus:ring-2
Color:           focus:ring-blue-200
Outline:         focus:outline-none
Border:          focus:border-blue-500
```

---

## Dark Mode Consideration

### Future Dark Mode Colors
```
Background:  #0f172a (Slate-900)
Card:        #1e293b (Slate-800)
Text:        #f1f5f9 (Slate-100)
Border:      #334155 (Slate-700)
```

---

## Design Variables Summary

| Element | Color | Size | Font |
|---------|-------|------|------|
| Primary Button | Blue-600 → Cyan-600 | px-8 py-4 | semibold |
| Text Heading | Slate-900 | 3xl-6xl | bold |
| Body Text | Slate-600 | base-lg | regular |
| Input Background | Slate-50 | full width | - |
| Border | Slate-200 | 1px | - |
| Error | Red-600 | - | medium |
| Success | Emerald-600 | - | medium |

---

## Quick Reference CSS Classes

### Most Common
```
Form: space-y-5
Cards: rounded-lg border border-slate-200
Text: text-slate-900 / text-slate-600
Buttons: px-4 py-3 rounded-lg transition
Focus: focus:outline-none focus:ring-2
Hover: hover:shadow-lg hover:bg-slate-50
Spacing: gap-4 / gap-8 / py-20 / px-6
```

---

**Last Updated**: 14 March 2026
**Version**: 1.0.0
**Status**: ✅ Complete
