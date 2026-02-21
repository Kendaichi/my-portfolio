# 3D Portfolio

A personal portfolio website featuring a 3D animated cube background, built with React, TypeScript, and Three.js.

## Tech Stack

- **Vite** — build tool and dev server
- **React 18** — UI framework
- **TypeScript** — type safety
- **Three.js / @react-three/fiber / @react-three/drei** — 3D rendering
- **Tailwind CSS** — styling
- **shadcn/ui** — UI components
- **React Router v6** — routing
- **React Hook Form + Zod** — form handling and validation

## Getting Started

**Prerequisites:** Node.js installed on your machine.

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate into the project
cd 3d-portfolio

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests |

## Project Structure

```
src/
├── assets/          # Images and static assets
├── components/      # Reusable components
│   ├── ui/          # shadcn/ui components
│   ├── CubeCanvas   # Three.js 3D cube
│   ├── HeroSection  # Landing hero
│   ├── Section      # Section wrapper
│   ├── ContactForm  # Contact form
│   └── NavLink      # Navigation link
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
├── pages/           # Page components
│   ├── Index.tsx    # Main portfolio page
│   └── NotFound.tsx # 404 page
└── main.tsx         # Entry point
```

## Customization

All portfolio content (skills, experience, projects, bio) is defined as constants at the top of `src/pages/Index.tsx`. Update those to make it your own.
