# Auto-LevelUp Website Design Specification

> Version 1.0 -- March 2026
> Author: Aria, Creative Design Lead
> Purpose: Component-by-component breakdown a developer can implement directly.

---

## Global Setup

### Font Loading

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

### Tailwind Config

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        midnight: '#0A1628',
        'signal-blue': '#2563EB',
        verdigris: '#0D9488',
        graphite: '#4B5563',
        ash: '#F3F4F6',
        'dark-surface': '#111D2E',
        'muted': '#94A3B8',
        'subtle': '#64748B',
        'dark-border': '#1E293B',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
}
```

### CSS Custom Properties (for motion)

```css
:root {
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast: 150ms;
  --duration-base: 300ms;
  --duration-slow: 600ms;
}
```

### Responsive Breakpoints

| Breakpoint | Width | Tailwind Prefix |
|-----------|-------|-----------------|
| Mobile | < 640px | default |
| Tablet | >= 640px | `sm:` |
| Desktop | >= 1024px | `lg:` |
| Wide | >= 1280px | `xl:` |

### Max Content Width

```html
<div class="max-w-[1120px] mx-auto px-6 lg:px-8">
```

---

## 1. Navigation

### Structure

```html
<nav class="fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300"
     id="main-nav">
  <div class="max-w-[1120px] mx-auto px-6 lg:px-8 h-full flex items-center justify-between">

    <!-- Logo -->
    <a href="/" class="text-lg font-bold tracking-tight">
      <span class="text-midnight">Auto</span><span class="text-signal-blue">LevelUp</span>
    </a>

    <!-- Nav Links (desktop) -->
    <div class="hidden lg:flex items-center gap-8">
      <a href="#" class="text-sm font-medium text-graphite hover:text-signal-blue transition-colors duration-150
                         relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[2px]
                         after:bg-signal-blue after:transition-all after:duration-200 hover:after:w-full">
        Home
      </a>
      <a href="#features" class="text-sm font-medium text-graphite hover:text-signal-blue transition-colors duration-150
                                  relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[2px]
                                  after:bg-signal-blue after:transition-all after:duration-200 hover:after:w-full">
        Features
      </a>
      <a href="#how-it-works" class="text-sm font-medium text-graphite hover:text-signal-blue transition-colors duration-150
                                      relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[2px]
                                      after:bg-signal-blue after:transition-all after:duration-200 hover:after:w-full">
        How It Works
      </a>
      <a href="#for-schools" class="text-sm font-medium text-graphite hover:text-signal-blue transition-colors duration-150
                                     relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[2px]
                                     after:bg-signal-blue after:transition-all after:duration-200 hover:after:w-full">
        For Schools
      </a>
    </div>

    <!-- CTA -->
    <a href="/demo" class="hidden lg:inline-flex items-center px-5 py-2 bg-signal-blue text-white
                           text-sm font-semibold rounded tracking-tight
                           hover:bg-blue-700 transition-colors duration-150">
      Book a Demo
    </a>

    <!-- Mobile Hamburger -->
    <button class="lg:hidden w-6 h-6 flex flex-col justify-center gap-[5px]" aria-label="Menu">
      <span class="w-full h-[1.5px] bg-midnight"></span>
      <span class="w-full h-[1.5px] bg-midnight"></span>
      <span class="w-full h-[1.5px] bg-midnight"></span>
    </button>
  </div>
</nav>
```

### Scroll Behavior

```js
// On scroll > 10px, add these classes to #main-nav:
// bg-white/80 backdrop-blur-lg
// Remove: bg-transparent
```

```css
#main-nav {
  background: transparent;
  transition: background-color 300ms var(--ease-out), backdrop-filter 300ms var(--ease-out);
}
#main-nav.scrolled {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
```

### Mobile Menu

```html
<div class="fixed inset-0 z-40 bg-midnight flex flex-col items-center justify-center gap-8
            transition-opacity duration-300"
     id="mobile-menu" style="display: none;">
  <a href="#" class="text-2xl font-semibold text-white opacity-0" style="animation: fadeInUp 400ms ease-out forwards; animation-delay: 0ms;">Home</a>
  <a href="#features" class="text-2xl font-semibold text-white opacity-0" style="animation: fadeInUp 400ms ease-out forwards; animation-delay: 50ms;">Features</a>
  <a href="#how-it-works" class="text-2xl font-semibold text-white opacity-0" style="animation: fadeInUp 400ms ease-out forwards; animation-delay: 100ms;">How It Works</a>
  <a href="#for-schools" class="text-2xl font-semibold text-white opacity-0" style="animation: fadeInUp 400ms ease-out forwards; animation-delay: 150ms;">For Schools</a>
  <a href="/demo" class="mt-4 px-8 py-3 bg-signal-blue text-white text-lg font-semibold rounded opacity-0"
     style="animation: fadeInUp 400ms ease-out forwards; animation-delay: 200ms;">Book a Demo</a>
</div>
```

---

## 2. Hero Section

### Layout

Full viewport height. Split 55/45 on desktop. Stacked on mobile.

### Structure

```html
<section class="relative min-h-screen flex items-center overflow-hidden"
         style="background: linear-gradient(135deg, #0A1628 0%, #111D2E 100%);">
  <div class="max-w-[1120px] mx-auto px-6 lg:px-8 py-24 lg:py-0
              grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 lg:gap-8 items-center">

    <!-- Left: Text Content -->
    <div>
      <!-- Overline -->
      <p class="text-[11px] font-bold tracking-[0.08em] uppercase text-signal-blue mb-4
                opacity-0 translate-y-5"
         data-animate="fadeUp" data-delay="200">
        AI-Powered Education Platform
      </p>

      <!-- Headline -->
      <h1 class="text-[clamp(2rem,5vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-white mb-6
                 opacity-0 translate-y-5"
          data-animate="fadeUp" data-delay="200">
        Every Student Deserves<br>to Level Up.
      </h1>

      <!-- Subheadline -->
      <p class="text-base text-[#94A3B8] max-w-[520px] mb-8
                opacity-0 translate-y-5"
         data-animate="fadeUp" data-delay="400">
        Auto-LevelUp is an AI education platform for schools. LvlUp Spaces gives every student
        a personalized AI tutor and adaptive learning experience. AutoGrade turns handwritten
        exam papers into fully graded, feedback-rich reports in minutes.
      </p>

      <!-- Buttons -->
      <div class="flex flex-wrap gap-4 mb-6 opacity-0 translate-y-5"
           data-animate="fadeUp" data-delay="600">
        <a href="/demo" class="px-6 py-3 bg-signal-blue text-white text-sm font-semibold rounded
                               hover:bg-blue-700 transition-colors duration-150">
          Book a Demo
        </a>
        <a href="#how-it-works" class="px-6 py-3 border border-white/20 text-white text-sm font-semibold rounded
                                       hover:border-white/40 transition-colors duration-150">
          See How It Works
        </a>
      </div>

      <!-- Proof Strip -->
      <p class="text-xs text-[#64748B] tracking-wide opacity-0"
         data-animate="fadeUp" data-delay="700">
        15 Question Types &middot; 8-Minute Grading &middot; 24/7 AI Tutor
      </p>
    </div>

    <!-- Right: Abstract UI Fragments -->
    <div class="hidden lg:block relative h-[400px]">
      <!-- Stylized card fragments positioned absolutely -->
      <!-- Each card uses exact brand tokens, built as flat CSS/SVG -->
      <!-- Cards shift 2-4px per 100px scroll for subtle parallax -->
      <div class="absolute top-[20%] left-[10%] w-[200px] bg-dark-surface border border-dark-border rounded-lg p-4
                  opacity-0 translate-x-4"
           data-animate="fadeLeft" data-delay="800">
        <!-- Progress bar card fragment -->
        <div class="text-xs font-bold text-white mb-2">Progress</div>
        <div class="h-2 bg-midnight rounded-full overflow-hidden">
          <div class="h-full w-[72%] bg-signal-blue rounded-full"></div>
        </div>
        <div class="text-[10px] text-muted mt-1">72% Complete</div>
      </div>

      <div class="absolute top-[45%] left-[30%] w-[180px] bg-dark-surface border border-dark-border rounded-lg p-4
                  opacity-0 translate-x-4"
           data-animate="fadeLeft" data-delay="900">
        <!-- Grade result fragment -->
        <div class="text-xs font-bold text-white mb-1">Exam Result</div>
        <div class="text-2xl font-extrabold text-verdigris">87%</div>
        <div class="text-[10px] text-muted">Graded in 8 min</div>
      </div>

      <div class="absolute top-[15%] right-[5%] w-[160px] bg-dark-surface border border-dark-border rounded-lg p-3
                  opacity-0 translate-x-4"
           data-animate="fadeLeft" data-delay="1000">
        <!-- Badge notification fragment -->
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-signal-blue/10 rounded-full flex items-center justify-center">
            <!-- badge icon inline SVG -->
          </div>
          <div>
            <div class="text-[10px] font-bold text-white">Badge Earned</div>
            <div class="text-[9px] text-muted">Quick Learner</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

### Motion Spec

```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes fadeLeft {
  from { opacity: 0; transform: translateX(16px); }
  to   { opacity: 1; transform: translateX(0); }
}

[data-animate="fadeUp"] {
  animation: fadeUp 600ms var(--ease-out) forwards;
}

[data-animate="fadeLeft"] {
  animation: fadeLeft 800ms var(--ease-out) forwards;
}

/* Apply data-delay as animation-delay via JS or inline style */
```

### Parallax (right-side cards)

```js
// On scroll, shift each card by (scrollY * 0.03) px vertically
// Maximum 8px shift. Use transform for GPU acceleration.
window.addEventListener('scroll', () => {
  const cards = document.querySelectorAll('[data-parallax]');
  const offset = Math.min(window.scrollY * 0.03, 8);
  cards.forEach(card => {
    card.style.transform = `translateY(${offset}px)`;
  });
});
```

---

## 3. Problem Section

### Layout

White background. Max-width 1120px. Centered.

### Structure

```html
<section class="py-24 bg-white">
  <div class="max-w-[1120px] mx-auto px-6 lg:px-8">
    <p class="text-[11px] font-bold tracking-[0.08em] uppercase text-graphite mb-3">
      The Challenge
    </p>
    <h2 class="text-[2.25rem] font-extrabold leading-[1.1] tracking-[-0.025em] text-midnight mb-10">
      Schools Face Four Problems Every Day
    </h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <!-- Problem Card (repeat x4) -->
      <div class="bg-ash border border-[#E5E7EB] rounded-lg p-6 border-l-[3px] border-l-verdigris
                  opacity-0 translate-y-3"
           data-scroll-animate data-delay="0">
        <div class="flex items-start gap-3">
          <span class="text-verdigris flex-shrink-0">
            <!-- Inline SVG icon (learning) -->
          </span>
          <div>
            <h4 class="text-[1.125rem] font-semibold text-midnight mb-1 tracking-[-0.01em]">
              One-Size-Fits-All Learning
            </h4>
            <p class="text-sm text-graphite leading-relaxed">
              Textbooks move at one pace. Advanced students disengage. Struggling students get left behind.
            </p>
          </div>
        </div>
      </div>
      <!-- ... 3 more cards with 100ms stagger -->
    </div>
  </div>
</section>
```

### Motion

```css
/* Scroll-triggered: IntersectionObserver at threshold 0.2 */
[data-scroll-animate] {
  transition: opacity 400ms var(--ease-out), transform 400ms var(--ease-out);
}
[data-scroll-animate].visible {
  opacity: 1;
  transform: translateY(0);
}
/* Stagger via transition-delay: data-delay * 100ms */
```

---

## 4. Solution Overview Section

### Layout

Midnight background. Full-width.

### Structure

```html
<section class="py-24 bg-midnight">
  <div class="max-w-[1120px] mx-auto px-6 lg:px-8">
    <p class="text-[11px] font-bold tracking-[0.08em] uppercase text-signal-blue mb-3">
      The Solution
    </p>
    <h2 class="text-[2.25rem] font-extrabold leading-[1.1] tracking-[-0.025em] text-white mb-10">
      Two Platforms. One Student Profile. Complete Insight.
    </h2>

    <div class="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8">
      <!-- LvlUp Spaces Card -->
      <div class="bg-dark-surface border border-dark-border rounded-lg overflow-hidden
                  border-t-[4px] border-t-signal-blue
                  opacity-0 -translate-x-4"
           data-scroll-animate>
        <div class="p-6">
          <h3 class="text-[1.75rem] font-bold text-white tracking-[-0.02em] mb-1">LvlUp Spaces</h3>
          <p class="text-sm text-muted mb-4">Continuous AI-Powered Learning</p>
          <ul class="space-y-2">
            <!-- 5 bullets with inline SVG check icons, text-sm text-white -->
          </ul>
          <div class="mt-6 pt-4 border-t border-dark-border flex gap-8">
            <div class="text-center">
              <div class="text-2xl font-extrabold text-signal-blue">15</div>
              <div class="text-xs text-muted">Question Types</div>
            </div>
            <!-- more stats -->
          </div>
        </div>
      </div>

      <!-- AutoGrade Card -->
      <div class="bg-dark-surface border border-dark-border rounded-lg overflow-hidden
                  border-t-[4px] border-t-verdigris
                  opacity-0 translate-x-4"
           data-scroll-animate data-delay="150">
        <!-- Same structure, verdigris accent -->
      </div>
    </div>
  </div>
</section>
```

### Motion

Cards slide in from their respective sides. 16px translate, 500ms ease-out. Staggered by 150ms.

---

## 5. Features Section -- LvlUp Spaces

### Layout

White background. Alternating left-right layout.

### Structure (3 feature clusters)

```html
<section class="py-24 bg-white" id="features">
  <div class="max-w-[1120px] mx-auto px-6 lg:px-8 space-y-24">

    <!-- Cluster 1: AI Tutor + Evaluator (text left, visual right) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div class="opacity-0 -translate-x-4" data-scroll-animate>
        <p class="text-[11px] font-bold tracking-[0.08em] uppercase text-signal-blue mb-3">AI Intelligence</p>
        <h3 class="text-[1.375rem] font-bold text-midnight tracking-[-0.015em] mb-3">
          Your Students Get a 24/7 AI Tutor
        </h3>
        <p class="text-base text-graphite leading-relaxed mb-4">
          A Socratic assistant attached to every question. It asks guiding questions,
          never gives the answer directly, and adapts to each student's pace.
        </p>
        <ul class="space-y-2">
          <li class="flex items-start gap-2 text-sm text-graphite">
            <span class="w-1.5 h-1.5 rounded-full bg-signal-blue mt-2 flex-shrink-0"></span>
            Socratic dialogue builds understanding, not dependency
          </li>
          <!-- 2 more bullets -->
        </ul>
      </div>
      <div class="opacity-0 translate-x-4" data-scroll-animate data-delay="200">
        <!-- Stylized chat interface mockup: flat CSS cards showing Q&A exchange -->
        <div class="bg-ash border border-[#E5E7EB] rounded-lg p-6">
          <!-- Chat bubbles using brand tokens -->
        </div>
      </div>
    </div>

    <!-- Cluster 2: 15 Question Types (text right, visual left) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div class="order-2 lg:order-1 opacity-0 -translate-x-4" data-scroll-animate data-delay="200">
        <!-- Difficulty curve visualization: simple SVG line chart -->
      </div>
      <div class="order-1 lg:order-2 opacity-0 translate-x-4" data-scroll-animate>
        <p class="text-[11px] font-bold tracking-[0.08em] uppercase text-signal-blue mb-3">Content Variety</p>
        <h3 class="text-[1.375rem] font-bold text-midnight tracking-[-0.015em] mb-3">
          15 Question Types. Adaptive Difficulty.
        </h3>
        <p class="text-base text-graphite leading-relaxed mb-4">
          From instant-graded MCQ to AI-evaluated essays, coding challenges, and audio recordings.
        </p>
        <div class="grid grid-cols-3 sm:grid-cols-5 gap-2">
          <!-- Question type chips -->
          <span class="text-xs font-medium text-graphite bg-ash border border-[#E5E7EB] rounded px-2 py-1 text-center">MCQ</span>
          <!-- ... 14 more -->
        </div>
      </div>
    </div>

    <!-- Cluster 3: Gamification (text left, visual right) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div class="opacity-0 -translate-x-4" data-scroll-animate>
        <p class="text-[11px] font-bold tracking-[0.08em] uppercase text-signal-blue mb-3">Motivation</p>
        <h3 class="text-[1.375rem] font-bold text-midnight tracking-[-0.015em] mb-3">
          Learning Feels Like Leveling Up
        </h3>
        <p class="text-base text-graphite leading-relaxed mb-4">
          XP for every question. Streaks for daily consistency. Badges across 5 rarity tiers.
          Leaderboards that reset weekly for fresh competition.
        </p>
        <div class="flex gap-3">
          <!-- 5 badge tier chips: Common through Legendary -->
          <span class="text-xs font-semibold text-graphite bg-ash border border-[#E5E7EB] rounded px-2.5 py-1">Common</span>
          <!-- ... -->
        </div>
      </div>
      <div class="opacity-0 translate-x-4" data-scroll-animate data-delay="200">
        <!-- Progress dashboard fragment: XP bar, streak counter, level indicator -->
      </div>
    </div>
  </div>
</section>
```

### Motion per Cluster

Scroll-triggered. Text side fades in + 16px translate from its side. Visual side fades in 200ms later. No parallax.

---

## 6. Features Section -- AutoGrade

### Layout

Ash background. Full-width.

### Structure

```html
<section class="py-24 bg-ash">
  <div class="max-w-[1120px] mx-auto px-6 lg:px-8">
    <h2 class="text-[2.25rem] font-extrabold leading-[1.1] tracking-[-0.025em] text-midnight mb-10">
      From Scan to Student Feedback -- Before the Next Period.
    </h2>

    <!-- 5-Step Pipeline (horizontal on desktop, vertical on mobile) -->
    <div class="relative flex flex-col lg:flex-row items-start lg:items-center gap-0 mb-16">
      <!-- Connecting line -->
      <div class="hidden lg:block absolute top-1/2 left-0 right-0 h-[1.5px] bg-verdigris -translate-y-1/2 -z-0"></div>

      <!-- Step (repeat x5) -->
      <div class="relative z-10 flex-1 text-center px-4 opacity-0 translate-y-3"
           data-scroll-animate data-delay="0">
        <div class="w-12 h-12 mx-auto mb-3 bg-white border-2 border-verdigris rounded-full
                    flex items-center justify-center
                    hover:bg-verdigris hover:text-white transition-colors duration-200 group">
          <!-- Inline SVG icon, stroke="currentColor" -->
        </div>
        <h4 class="text-sm font-bold text-midnight mb-1">Scan</h4>
        <p class="text-xs text-graphite">Any phone, no hardware</p>
      </div>
      <!-- Steps 2-5 with 100ms stagger each -->
    </div>

    <!-- 2x2 Feature Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div class="bg-white border border-[#E5E7EB] border-l-[3px] border-l-verdigris rounded-lg p-6">
        <h4 class="text-[1.125rem] font-semibold text-midnight mb-1">Rubric Modes</h4>
        <p class="text-sm text-graphite">4 configurable modes: criteria, dimension, holistic, hybrid.</p>
      </div>
      <!-- Bulk Grading, Manual Override, Cost Tracking -->
    </div>
  </div>
</section>
```

### Pipeline Animation

Steps reveal left-to-right on scroll, 100ms stagger. The connecting line draws in using `stroke-dashoffset` animation (300ms).

```css
.pipeline-line {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  transition: stroke-dashoffset 1s var(--ease-out);
}
.pipeline-line.visible {
  stroke-dashoffset: 0;
}
```

---

## 7. Stakeholder Sections

### Layout

One section per stakeholder. All use the SAME layout template. White background.

### Template

```html
<section class="py-24 bg-white border-t border-[#E5E7EB]">
  <div class="max-w-[1120px] mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[40%_60%] gap-12 items-start">

    <!-- Left: Text -->
    <div class="opacity-0 -translate-x-4" data-scroll-animate>
      <h2 class="text-[1.75rem] font-bold text-midnight tracking-[-0.02em] mb-3">For Teachers</h2>
      <p class="text-base text-graphite leading-relaxed mb-4">
        Auto-LevelUp gives teachers back their time. An exam that takes a weekend to grade
        takes 8-15 minutes with AutoGrade.
      </p>
      <ul class="space-y-2">
        <li class="flex items-start gap-2 text-sm text-graphite">
          <span class="w-1.5 h-1.5 rounded-full bg-signal-blue mt-2 flex-shrink-0"></span>
          Grade an entire class exam in 8-15 minutes
        </li>
        <!-- 4 more bullets -->
      </ul>
    </div>

    <!-- Right: Dashboard Preview -->
    <div class="opacity-0 translate-x-4" data-scroll-animate data-delay="200">
      <div class="bg-ash border border-[#E5E7EB] rounded-lg p-6">
        <!-- Flat, stylized card arrangement showing stakeholder's dashboard view -->
        <!-- Uses brand color tokens, not screenshots -->
      </div>
    </div>
  </div>
</section>
```

### Stakeholder Differentiation

All four sections (Teacher, Student, Parent, Admin) use identical CSS. Differentiation is through content only -- different headline, bullets, and dashboard mockup data. All use Midnight + Signal Blue. No per-stakeholder color coding.

### Motion

Text fades in from left, dashboard preview fades in from right, 200ms stagger.

---

## 8. Stats Section

### Layout

Midnight background. Single row of 5 stats.

### Structure

```html
<section class="py-20 bg-midnight">
  <div class="max-w-[1120px] mx-auto px-6 lg:px-8
              flex flex-wrap justify-center gap-12 lg:gap-16">
    <!-- Stat Item (repeat x5) -->
    <div class="text-center" data-count-up>
      <div class="text-[3rem] font-extrabold text-white leading-[1.05] tracking-[-0.03em]"
           data-target="15">0</div>
      <div class="text-xs font-medium text-muted mt-1 tracking-wide">Question Types</div>
    </div>
    <!-- 8 Apps, 8 Min, 24/7, 5 Signals -->
  </div>
</section>
```

### Count-Up Animation

```js
// IntersectionObserver triggers at threshold 0.5
// Each number counts from 0 to target over 200ms per digit
// Staggered 100ms between stats
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      animateCount(el, 0, target, 800);
    }
  });
}, { threshold: 0.5 });

function animateCount(el, start, end, duration) {
  const startTime = performance.now();
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(start + (end - start) * eased);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}
```

---

## 9. Footer

### Layout

Midnight background. Three rows.

### Structure

```html
<footer class="bg-midnight pt-16 pb-8">
  <div class="max-w-[1120px] mx-auto px-6 lg:px-8">
    <!-- Top Row -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
      <div>
        <div class="text-lg font-bold tracking-tight mb-1">
          <span class="text-white">Auto</span><span class="text-signal-blue">LevelUp</span>
        </div>
        <p class="text-sm text-muted">Every Student Deserves to Level Up.</p>
      </div>
      <a href="/demo" class="px-6 py-3 bg-signal-blue text-white text-sm font-semibold rounded
                             hover:bg-blue-700 transition-colors duration-150">
        Book a Demo
      </a>
    </div>

    <!-- Middle Row -->
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-8 mb-8">
      <div>
        <h4 class="text-xs font-bold text-white tracking-wider uppercase mb-3">Product</h4>
        <ul class="space-y-2">
          <li><a href="#" class="text-sm text-muted hover:text-white transition-colors duration-150">LvlUp Spaces</a></li>
          <li><a href="#" class="text-sm text-muted hover:text-white transition-colors duration-150">AutoGrade</a></li>
        </ul>
      </div>
      <div>
        <h4 class="text-xs font-bold text-white tracking-wider uppercase mb-3">Company</h4>
        <ul class="space-y-2">
          <li><a href="#" class="text-sm text-muted hover:text-white transition-colors duration-150">About</a></li>
          <li><a href="#" class="text-sm text-muted hover:text-white transition-colors duration-150">Contact</a></li>
        </ul>
      </div>
      <div>
        <h4 class="text-xs font-bold text-white tracking-wider uppercase mb-3">Legal</h4>
        <ul class="space-y-2">
          <li><a href="#" class="text-sm text-muted hover:text-white transition-colors duration-150">Privacy</a></li>
          <li><a href="#" class="text-sm text-muted hover:text-white transition-colors duration-150">Terms</a></li>
        </ul>
      </div>
    </div>

    <!-- Divider -->
    <div class="h-px bg-dark-border mb-6"></div>

    <!-- Bottom Row -->
    <p class="text-xs font-medium text-subtle">
      &copy; 2026 Auto-LevelUp. All rights reserved.
    </p>
  </div>
</footer>
```

---

## 10. Global Motion System

### Scroll Reveal (IntersectionObserver)

```js
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay || 0);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      scrollObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('[data-scroll-animate]').forEach(el => {
  scrollObserver.observe(el);
});
```

### CSS Base for Animated Elements

```css
[data-scroll-animate] {
  opacity: 0;
  transition: opacity 400ms var(--ease-out), transform 400ms var(--ease-out);
}
[data-scroll-animate].visible {
  opacity: 1;
  transform: translateY(0) translateX(0);
}
```

### Animation Rules

| Context | Duration | Easing | Transform |
|---------|----------|--------|-----------|
| Headline fade up | 600ms | ease-out | translateY(20px) |
| Subheadline fade up | 600ms | ease-out | translateY(20px) |
| Button fade up | 400ms | ease-out | translateY(20px) |
| Card reveal | 400ms | ease-out | translateY(12px) |
| Card from left | 500ms | ease-out | translateX(-16px) |
| Card from right | 500ms | ease-out | translateX(16px) |
| Pipeline step | 300ms | ease-out | translateY(12px) |
| Micro-interactions | 100-200ms | ease-out | n/a |

### What Never Happens

- Nothing bounces.
- Nothing pulses.
- Nothing spins (unless it is a loading spinner).
- No spring physics.
- No overshoot.
- No decorative motion.

---

## 11. Icon Usage

All icons are inline SVG from the custom icon set at `docs/design/icons/`. Never import from Lucide, Heroicons, or any icon library.

### Standard Usage

```html
<span class="text-verdigris">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <!-- paths from icon file -->
  </svg>
</span>
```

### Sizing

| Context | Size | Class |
|---------|------|-------|
| Inline with text | 20px | `w-5 h-5` |
| Card icon | 24px | `w-6 h-6` |
| Feature icon | 32px | `w-8 h-8` |
| Hero / stakeholder | 40px | `w-10 h-10` |

Color is always set via `text-{color}` on the parent, inherited through `currentColor`.

---

*End of Website Design Specification v1.0*
