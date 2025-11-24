# M2M Website

Welcome to the website for Muscle to Movement (M2M). You'll find everything here, including information on project structure, the tech stack, as well as any other information.

## Tech Stack

- **Framework:** Next.js 16 (App Router) with React 19 and TypeScript
- **Styling:** Tailwind CSS via `@tailwindcss/postcss`, glassmorphism utility classes, and responsive layout helpers defined in `src/app/globals.css`
- **Animation:** Anime.js powers scroll reveals and the interactive water drop background grid
- **Tooling:** ESLint 9 with the Next.js config, TypeScript type checking, and the App Router font pipeline (`next/font` with Geist), would be nice to also implement prettier

## Design

Current implementation of the website uses a "glassmorphic" design pattern. This is inspired by current (2025 lol) tech design. I dont know who be reading this but if youre designing new pages, you can use liquid glass in iOS 26 as a reference.

## Project Structure

```
src/
├─ app/               # App Router routes, global layout, and page-level logic
│   ├─ layout.tsx     # Root layout which ensures layout consistency
│   ├─ page.tsx       # Home page
│   ├─ globals.css    # Put reuseable css classes in here
│   ├─ examplePage    # Route folder (this determines the name of the route)
│       └─ page.tsx   # Page component
├─ components/        # Globally reusable components
├─ data/              # Constants/lists of data we can iterate through live here
└─ features/          # Modular components that are reused across pages
    └─ home/          # page-specific building blocks/components
```

## Run scripts

I think everbody should be familiar with these. You really only need to know the first one

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Deploy on Vercel

This app is not deployed at the moment, but I want it to be deployed through Vercel.

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
