---
title: 'Create a Shadcn UI Component Library with Tailwind v4 and Vite's library mode'
pubDate: 2025-05-16
description: 'A guide to create a custom component library using shadcn/ui'
author: 'Kuro'
language: en
heroImage: "../../../images/blog/hero-vps.png"
keywords: ['Tailwind', 'Shadcn', 'UI', 'Component', 'Library', 'Tailwind v4', 'Vite', 'Library mode', 'vite', 'react', 'tutorial', 'typescript', 'software', 'coding', 'development', 'engineering', 'inclusive', 'community']
image:
  url: 'https://docs.astro.build/assets/full-logo-light.png'
  alt: 'The full Astro logo.'
tags: ['typescript', 'react',]
layout: ../../../layouts/PostLayout.astro
draft: false
---

If you are a react developer, you probably know that shadcn/ui is a library of pre-built components that you can use in your projects.

Today, we are going to learn how to create a custom component library using shadcn/ui and Tailwind v4.

## Prerequisites

- Node.js
- Vite
- Tailwind CSS
- Shadcn/ui

## Creating the project

Let's create a new project with Vite.

```bash
pnpm create vite@latest

◇  Project name:
│  ui-lib
│
◇  Select a framework:
│  React
│
◇  Select a variant:
│  TypeScript
│
◇  Scaffolding project in /Users/kuro/Development/ui-lib...
│
└  Done. Now run:

  cd ui-lib
  pnpm install
  pnpm run dev
```


### Add Tailwind v4

Let's add Tailwind v4 and the neccesary dependencies to the project.

```bash
pnpm install -D tailwindcss @tailwindcss/vite jest @jest/globals @types/node

```

Once Tailwind is installed, we need to prepare the configuration of the project.

### Cleaning up the project

We will want to remove the default components that Vite creates. As well as the App.tsx file
We are only keep the essential files to start with.

```bash
rm -rf public/ src/** index.html tsconfig.app.json tsconfig.node.json
```

Then we are going to create the files that we will need to start with.

```bash
mkdir src/lib types
touch src/lib/main.ts src/style.css types/base.json types/react-library.json
```

These are the contents of the files above.

```typescript
//src/lib/main.ts
import '../style.css';
```

```bash
#src/style.css
@import "tailwindcss";
```


```bash
#types/base.json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "composite": false,
    "declaration": true,
    "declarationMap": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "allowImportingTsExtensions": true,
    "inlineSources": false,
    "isolatedModules": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "preserveWatchOutput": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "strictNullChecks": true
  },
  "exclude": ["node_modules"]
}
```

```bash
#types/react-library.json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "lib": ["ES2015"],
    "module": "ESNext",
    "target": "ES6",
    "jsx": "react-jsx",
    "noEmit": true
  }
}
```

Then we modify our `tsconfig.json` so it can read this config

```bash
{
  "extends": "./types/react-library.json",
  "compilerOptions": {
    "lib": ["dom", "ES2015"],
    "sourceMap": true,
    "types": ["jest", "node"],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src", "lib"],
  "exclude": ["dist", "build", "node_modules", "**/*.test.ts", "**/*.test.tsx"]
}
```

Then we add this line in `style.css`

```bash
@import "tailwindcss";
```

We'll return to the `main.ts` in a moment, but first let's add it to the config file.

We need to install a few plugins in order to make the builds succeed.

```bash
pnpm i -D vite-plugin-dts @vitejs/plugin-react vite-plugin-css-injected-by-js
```

Then we can modify our `vite.config.ts` to use the plugins and let vite know where our `main.ts` is and how to export the files.

```javascript
# vite.config.ts
import tailwindcss from '@tailwindcss/vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import react from '@vitejs/plugin-react';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    dts({ include: ['src/lib'] }),
    react(),
    tailwindcss(),
    cssInjectedByJsPlugin()
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/lib/main.ts'),
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        assetFileNames: 'assets/[name].[extname]',
        entryFileNames: '[name].[format].js'
      }
    }
  }
});
```

### Vite's library mode

Vite's library mode is a feature that allows you to create a library of components that can be used in any project.

This is done by using the `build.lib` option of the config and settings the path and formats.

We'll also want to remove any dependency not neccesary for the project with the `build.rollupOptions.external` parameter. Every dependecy expecified here will be excluded from the final build.
This is important because we don't want to bundle react or react-dom with our library. We want to use the ones that are already installed in the project.

## Adding a shadcn/ui component

Now that we have the project set up, we can start adding components to our library.

Let's start by adding the shadcn/ui configuration.

Let's add more dependencies

```bash
pnpm add class-variance-authority clsx tailwind-merge lucide-react tw-animate-css
```

We need to update the `src/styles.css` file with the shadcn/ui classes

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --radius: 0.625rem;
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.145 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.145 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.985 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.396 0.141 25.723);
  --destructive-foreground: oklch(0.637 0.237 25.331);
  --border: oklch(0.269 0 0);
  --input: oklch(0.269 0 0);
  --ring: oklch(0.439 0 0);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(0.269 0 0);
  --sidebar-ring: oklch(0.439 0 0);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

then, add a cn-helper

```typescript
//lib/util.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

and of course, a `components.json` file

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/style.css",
    "baseColor": "zinc",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

That's it, now we can start adding components.

### Adding a button

Let's start with a simple button.

```bash
pnpm dlx shadcn@latest add button

✔ Checking registry.
✔ Installing dependencies.
✔ Created 1 file:
  - src/components/button.tsx
```

As you can see, it should create a button in `src/components/button.tsx`
I will make use of this structure to rename the folder and file to `src/button/index.tsx`

Now it's time to edit `src/lib/main.ts` and add our component

```typescript
//src/lib/main.ts
import '../style.css';
export { Button } from '../button';
```

### Building our library

In order to make a build we have to add a few changes to the `package.json`

```json
{
  ...
  "sideEffects": false,
  "files": [
    "dist/**",
    "dist"
  ],
  "main": "dist/main.es.js",
  "types": "dist/lib/main.d.ts",
  "scripts": {
    "build": "vite build",
    "dev": "vite --host 0.0.0.0 --port 3003 --clearScreen false",
    "check-types": "tsc --noEmit",
    "lint": "eslint src/",
    "test": "jest"
  },
  "jest": {
    "preset": "@backlogg/jest-presets/browser"
  },
  ...
}
```

Everything is ready, you should be able to compile your library.

```bash
❯ pnpm build

> ui-lib@0.0.0 build /Users/kuro/Development/ui-lib
> vite build

vite v6.3.5 building for production...
✓ 9 modules transformed.

[vite:dts] Start generate declaration files...
dist/main.es.js  92.91 kB │ gzip: 17.93 kB
[vite:dts] Declaration files built in 576ms.

dist/main.cjs.js  44.05 kB │ gzip: 13.07 kB
✓ built in 750ms
```

You'll probably notice that we exported the same files that we added earlier in the `package.json`

Now, you can publish your library to npm and use it like:

```jsx
import { Button } from '@repo/ui'; // <- your package name
import './styles.css';

function App() {
  return (
    <div className='container'>
      <h1 className='title'>
        UI lib
      </h1>
      <Button>Click me</Button>
    </div>
  );
}

export default App;
```

And the component along their css should be appear correctly.

![Imported button](/05/button.png)