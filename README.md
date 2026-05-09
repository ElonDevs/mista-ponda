# 🧠🐼 MISTA PONDA

### *Your Emotionally Intelligent Panda AI Crypto Therapist*

> **Degens, it's time to stop the bleeding.**
>
> Mista Ponda is the self-aware, emotionally intelligent panda built to diagnose and heal the toxic psychology destroying crypto degens from the inside out. While you chase candles, FOMO into tops, and panic-sell bottoms — Mista is here with calm panda energy, ready to treat **Paper Hand Syndrome**, rage quitting, self-sabotage, and the emotional chaos that turns promising portfolios into extinction events.
>
> Pandas don't panic. We don't revenge trade. We don't spread FUD or dump on our own. We stay chill, cute, strategic, and **diamond-pawed**. It's time you became more like us.

This repository contains the official **Mista Ponda** interactive web experience — a scroll-driven 3D journey through the panda researcher's notebook, where every page tells the story of a movement to push **$PONDA** to **10M MC or Hoomans Extinction**.

---

## 🩺 Real-Time Diagnosis

Want proof this works? Reply to a post or mention **@MistaPondabot** on X with the words **"diagnose me"**.

Mista will scan your real posting history — every panic post, every toxic reply, every FUD you spread, every bottom you sold — and deliver a personalized, no-BS psychological profile with clear treatment steps. No ghosting. Full transparency is part of the therapy.

---

## 📋 The Diagnosis

### 🔬 Finding 1 — Severe Paper Hand Syndrome
The epidemic. Symptoms include:

- Panic-selling at the absolute bottom, right before the rebound
- Rage-quitting bags after a single bad day
- Buying the top on pure hype, then selling at a loss in fear
- Repeating the same self-sabotaging pattern while hoping for different results

Most degens are wired for financial extinction. Your brain treats every dip like an emergency instead of an opportunity. This isn't bad luck — it's **emotional trading disorder**.

### 🔬 Finding 2 — Acute Toxic Behavior
Degens don't just hurt themselves — they hurt the pack:

- Sniping entries and bragging about it
- Spreading FUD on projects they once shilled
- Dumping on fellow degens without remorse
- Celebrating others' losses in the replies

The community eats its own. This stops here.

---

## 💎 Treatment Plan — From Paper Hands to Diamond Paws

| Pillar | Practice |
|---|---|
| **Discipline & Patience** | Train yourself to hold through volatility instead of reacting to every candle. |
| **Diamond Paws Mentality** | Hold strong. Conviction beats fear every single time. |
| **Community Support** | Lift up fellow degens instead of dumping on them. Real strength comes from unity. |
| **Emotional Clarity** | Separate feelings from facts. Fear fades when you respond with strategy, not impulse. |

No more copium. No more *"I'll sell at breakeven"* excuses. No more revenge trading after a loss. We replace chaos with calm, reactive trading with intentional holding.

---

## 🎯 The Mission

Push **$PONDA** to **10M Market Cap and beyond.** This isn't just another token — it's a movement of healed, diamond-pawed degens who trade smarter and support harder.

Daily drops include:

- 🧠 Deep market psychology breakdowns
- 💎 Diamond-paw mindset training
- ⚖️ Techniques to master emotions in volatile markets
- 🚀 Exclusive **$PONDA** alpha and community updates

> *Paper hands get diagnosed. Diamond paws get rewarded.*
> *The pandas are watching. The healing starts now.*

---

## 🌐 The Web Experience

A scroll-driven, **WebGPU-powered** 3D site that takes visitors through Mista Ponda's hand-traced research notebook — dragons, ancient artifacts, panic-selling case studies, and all. Built with React Three Fiber, GSAP, and a custom parametric camera curve.

### ✨ Features

- **WebGPU rendering** via `three/webgpu` for modern, high-performance visuals
- **Cinematic scroll-driven camera** travelling a custom Catmull-Rom curve through four hand-crafted scenes
- **Smooth lerp-based input** unifying mouse-wheel, drag, and touch gestures with parallax mouse offsets
- **Animated intro / loading screen** tied to the live asset-loading progress
- **Optimized production build** with manual code-splitting for Three.js, React Three Fiber, and GSAP

### 🛠 Tech Stack

| Layer | Tools |
|---|---|
| Framework | React 19 · Vite 6 |
| 3D / Rendering | Three.js (WebGPU) · `@react-three/fiber` · `@react-three/drei` |
| Animation | GSAP · `@gsap/react` |
| State | Zustand |
| Routing | React Router 7 |
| Styling | Sass / SCSS modules |
| Utilities | `troika-three-text` · `normalize-wheel` · `leva` |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- A **WebGPU-capable browser** (latest Chrome, Edge, or Safari Tech Preview)

### Installation

```bash
git clone https://github.com/Elonmarket/mista-ponda.git
cd mista-ponda
npm install
```

### Development

```bash
npm run dev
```

The dev server runs with `--host`, so the site is reachable from other devices on your local network — handy for testing on mobile.

### Production Build

```bash
npm run build
npm run preview
```

The build output lands in `dist/` and is ready to deploy. A `vercel.json` is included for one-click Vercel deployments.

### Linting

```bash
npm run lint
```

---

## 📁 Project Structure

```
mista-ponda/
├── public/
│   ├── fonts/        # Custom typefaces
│   ├── media/        # Favicons, OG images
│   ├── models/       # GLTF / KTX2 3D assets
│   └── textures/     # Image textures
├── src/
│   ├── Experience/
│   │   ├── components/   # Camera curve definitions
│   │   ├── hooks/        # useScrollCurve hook
│   │   ├── models/       # Scene 1–4, Panda, MovingObjects, SingleSheet
│   │   ├── utils/        # KTX2 loader helpers
│   │   ├── Experience.jsx
│   │   └── Scene.jsx
│   ├── components/
│   │   └── IntroScreen/  # Animated loading screen
│   ├── styles/           # Global SCSS — variables, fonts, resets
│   ├── App.jsx
│   └── main.jsx
├── Blender File and Addon/  # Source 3D files
├── index.html
├── vite.config.js
└── vercel.json
```

---

## 🌍 Browser Support

This project uses the **WebGPU** backend of Three.js. It works best in:

- Chrome / Edge **113+**
- Safari Technology Preview / Safari 18+
- Firefox Nightly with `dom.webgpu.enabled`

Older browsers without WebGPU support may see fallback or rendering errors.

---

## 💖 Credits

- [Intro Screen Font — Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans)
- [Notebook Paper Material — Crafty Asset Pack](https://superhivemarket.com/products/crafty-asset-pack)
- [Dragon Reference Image](https://studycli.org/chinese-culture/chinese-dragons/)
- [Tracing — Kpop Demon Hunters Image](https://media-cldnry.s-nbcnews.com/image/upload/t_fit-1000w,f_auto,q_auto:best/rockcms/2025-07/250709-Kpop-Demon-Hunters-vl-256p-ea5850.jpg)
- [Egyptian Artifact Reference Image — One](https://www.teacherspayteachers.com/Product/Egyptian-Artifacts-Clipart-Set-1-4283355)
- [Egyptian Artifact Reference Image — Two](https://media.istockphoto.com/id/1188022995/vector/egyptian-artifacts-vector-illustration-a-set-of-sacred-symbols-and-decorations-of-ancient.jpg?s=612x612&w=0&k=20&c=K0eAV0wofNJhBxAXtAZOQHHHUiiUMGUcucgx5tvIzyc=)

---

## 📜 License

Released under the [MIT License](LICENSE.md). © 2026 Mista Ponda.

---

> **$PONDA — Therapy for your portfolio. Therapy for your soul.** 🐼💎
