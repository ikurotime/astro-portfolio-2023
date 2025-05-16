---
title: 'Crear una Libreria de Componentes Shadcn UI con Tailwind v4 y el modo biblioteca de Vite'
pubDate: 2025-05-16
description: 'Una guía completa para crear componentes usando shadcn/ui, con explicaciones detalladas de cada paso'
author: 'Kuro'
language: es
heroImage: "../../../images/blog/lib.jpg"
keywords: ['Tailwind', 'Shadcn', 'UI', 'Componente', 'Biblioteca', 'Tailwind v4', 'Vite', 'Modo biblioteca', 'vite', 'react', 'tutorial', 'typescript', 'software', 'programación', 'desarrollo', 'ingeniería', 'inclusivo', 'comunidad']
image:
  url: 'https://docs.astro.build/assets/full-logo-light.png'
  alt: 'El logotipo completo de Astro.'
tags: ['typescript', 'react',]
layout: ../../../layouts/PostLayout.astro
draft: false
---


Si eres desarrollador de React, probablemente hayas oído hablar de shadcn/ui - una colección de componentes bellamente diseñados y accesibles que puedes copiar y personalizar para tus proyectos. En esta guía, aprenderemos a crear nuestra propia biblioteca de componentes usando shadcn/ui y Tailwind v4, facilitando el compartir y reutilizar componentes en diferentes proyectos.

Puedes ver el codigo en [github](https://github.com/ikurotime/ui-lib-template)

## Lo que Vamos a hacer

Vamos a crear una libreria de componentes que:
- Utiliza herramientas modernas (Vite, Tailwind v4, TypeScript)
- Puede ser publicada en npm
- Incluye componentes de shadcn/ui
- Soporta formatos ESM y CommonJS
- Tiene soporte adecuado para TypeScript
- Incluye CSS-in-JS para fácil consumo

## Requisitos Previos

Antes de comenzar, asegúrate de tener:
- Node.js instalado (versión 18 o superior recomendada)
- Conocimientos básicos de React y TypeScript
- Familiaridad con la gestión de paquetes npm/pnpm
- Un editor de código (VS Code recomendado)

## Paso 1: Configuración del Proyecto

### 1.1 Crear un Nuevo Proyecto

Primero, vamos a crear un nuevo proyecto usando Vite. Usaremos pnpm como gestor de paquetes, pero puedes usar npm o yarn si lo prefieres.

```bash
# Crear un nuevo proyecto con Vite
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

### 1.2 Instalar Dependencias Principales

Vamos a instalar las dependencias esenciales que necesitaremos:

```bash
# Dependencias
pnpm install -D tailwindcss @tailwindcss/vite jest @jest/globals @types/node
```

Estos paquetes son:
- `tailwindcss`: El framework principal de Tailwind CSS
- `@tailwindcss/vite`: Plugin de Vite para Tailwind
- `jest` y `@jest/globals`: Para probar nuestros componentes
- `@types/node`: Definiciones de TypeScript para Node.js

## Paso 2: Estructura del Proyecto

### 2.1 Limpiar Archivos por Defecto

Comenzaremos con una base limpia eliminando los archivos que Vite crea por defecto:

```bash
# Eliminar archivos y directorios por defecto
rm -rf public/ src/** index.html tsconfig.app.json tsconfig.node.json
```

### 2.2 Crear Directorios y Archivos Esenciales

Vamos a crear la estructura básica para nuestra biblioteca:

```bash
# Crear directorios necesarios
mkdir src/lib types

# Crear archivos esenciales
touch src/lib/main.ts src/style.css types/base.json types/react-library.json
```

Esta estructura es importante porque:
- `src/lib/`: Contendrá el punto de entrada de nuestra biblioteca y utilidades
- `types/`: Contiene archivos de configuración de TypeScript
- `src/style.css`: Contendrá nuestros estilos globales e importaciones de Tailwind

### 2.3 Configurar TypeScript

Crearemos dos archivos de configuración de TypeScript:

1. Primero, crea `types/base.json` para nuestra configuración base de TypeScript:

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "composite": false,
    "declaration": true,        // Genera archivos .d.ts
    "declarationMap": true,     // Genera sourcemaps para archivos .d.ts
    "esModuleInterop": true,    // Habilita importaciones más limpias
    "forceConsistentCasingInFileNames": true,
    "allowImportingTsExtensions": true,
    "inlineSources": false,
    "isolatedModules": true,
    "module": "ESNext",         // Usa módulos modernos de JavaScript
    "moduleResolution": "Bundler",
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "preserveWatchOutput": true,
    "skipLibCheck": true,
    "strict": true,            // Habilita verificación estricta de tipos
    "noEmit": true,
    "strictNullChecks": true
  },
  "exclude": ["node_modules"]
}
```

2. Luego, crea `types/react-library.json` para configuraciones específicas de React:

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "lib": ["ES2015"],         // Características modernas de JavaScript
    "module": "ESNext",        // Sistema de módulos moderno
    "target": "ES6",           // Objetivo de JavaScript moderno
    "jsx": "react-jsx",        // Soporte para JSX de React
    "noEmit": true
  }
}
```

3. Finalmente, actualiza el `tsconfig.json`:

```json
{
  "extends": "./types/react-library.json",
  "compilerOptions": {
    "lib": ["dom", "ES2015"],  // Añade tipos DOM para entorno navegador
    "sourceMap": true,         // Genera source maps
    "types": ["jest", "node"], // Incluye definiciones de tipos
    "baseUrl": ".",           // Directorio base para importaciones
    "paths": {
      "@/*": ["./src/*"]      // Habilita importaciones con @
    }
  },
  "include": ["src", "lib"],
  "exclude": ["dist", "build", "node_modules", "**/*.test.ts", "**/*.test.tsx"]
}
```

## Paso 3: Configurar Vite

### 3.1 Instalar Plugins de Vite

Necesitamos algunos plugins adicionales de Vite para manejar declaraciones de TypeScript y CSS:

```bash
pnpm i -D vite-plugin-dts @vitejs/plugin-react vite-plugin-css-injected-by-js
```

Estos plugins son:
- `vite-plugin-dts`: Genera archivos de declaración de TypeScript
- `@vitejs/plugin-react`: Soporte de React para Vite
- `vite-plugin-css-injected-by-js`: Inyecta CSS en JavaScript

### 3.2 Configurar Vite

Crea o actualiza `vite.config.ts`:

```typescript
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
    dts({ include: ['src/lib'] }),  // Genera archivos .d.ts
    react(),                         // Habilita React
    tailwindcss(),                   // Habilita Tailwind
    cssInjectedByJsPlugin()         // Inyecta CSS en JS
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/lib/main.ts'),  // Punto de entrada de la biblioteca
      formats: ['es', 'cjs']                         // Formatos de salida
    },
    rollupOptions: {
      // Dependencias externas que no deben incluirse en el bundle
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        assetFileNames: 'assets/[name].[extname]',
        entryFileNames: '[name].[format].js'
      }
    }
  }
});
```

Esta configuración:
- Establece nuestro punto de entrada de la biblioteca
- Configura formatos de salida (ESM y CommonJS)
- Excluye React del bundle
- Maneja el nombramiento de archivos y assets

## Paso 4: Añadir Soporte para Shadcn/ui

### 4.1 Instalar Dependencias Requeridas

```bash
pnpm add class-variance-authority clsx tailwind-merge lucide-react tw-animate-css
```

Estos paquetes son:
- `class-variance-authority`: Para gestionar variantes de componentes
- `clsx` y `tailwind-merge`: Para gestión de nombres de clases
- `lucide-react`: Biblioteca de iconos
- `tw-animate-css`: Utilidades de animación

### 4.2 Configurar Estilos

Actualiza `src/style.css` con los estilos base de shadcn/ui:

```css
@import "tailwindcss";
@import "tw-animate-css";

/* Dark mode support */
@custom-variant dark (&:is(.dark *));

/* CSS Variables for theming */
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

/* Dark theme variables */
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

/* Theme configuration */
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

/* Base styles */
@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### 4.3 Añadir Funciones de Utilidad

Crea `src/lib/utils.ts` para nuestras funciones de utilidad:

```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Función de utilidad para combinar clases de Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### 4.4 Configurar Shadcn/ui

Crea `components.json` en el directorio raíz:

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

## Paso 5: Añadir tu Primer Componente

### 5.1 Añadir un Componente Botón

```bash
# Añadir el componente botón usando la CLI de shadcn
pnpm dlx shadcn@latest add button
```

Esto creará un componente botón en `src/components/button.tsx`. Vamos a moverlo a una mejor ubicación:

```bash
# Crear un directorio dedicado para el botón
mkdir -p src/button
mv src/components/button.tsx src/button/index.tsx
```

### 5.2 Exportar el Componente

Actualiza `src/lib/main.ts` para exportar nuestro botón:

```typescript
//src/lib/main.ts
import '../style.css';
export { Button } from '../button';
```

## Paso 6: Configurar Package.json

Actualiza tu `package.json` para incluir los campos necesarios para publicar:

```json
{
  "name": "@your-package-name/ui",
  "version": "0.0.1",
  "sideEffects": false,
  "files": [
    "dist/**",
    "dist"
  ],
  "main": "dist/main.es.js",        // Punto de entrada CommonJS
  "module": "dist/main.es.js",      // Punto de entrada ESM
  "types": "dist/lib/main.d.ts",    // Declaraciones de TypeScript
  "scripts": {
    "build": "vite build",
    "dev": "vite --host 0.0.0.0 --port 3003 --clearScreen false",
    "check-types": "tsc --noEmit",
    "lint": "eslint src/",
    "test": "jest"
  },
  "jest": {
    "preset": "@backlogg/jest-presets/browser"
  }
}
```

## Paso 7: Construir y Probar

### 7.1 Construir la Biblioteca

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

Esto creará:
- `dist/main.es.js`: Versión ESM
- `dist/main.cjs.js`: Versión CommonJS
- `dist/lib/main.d.ts`: Declaraciones de TypeScript

### 7.2 Usar la Biblioteca

Ahora puedes usar tu biblioteca en otros proyectos:

```jsx
import { Button } from '@your-package-name/ui';
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
```

![Botón importado](/05/button.png)

## Próximos Pasos

Ahora que tienes una biblioteca de componentes básica configurada, puedes:
1. Añadir más componentes usando `shadcn/ui`
2. Escribir pruebas para tus componentes
3. Añadir documentación
4. Publicar en npm
5. Añadir más características como:
   - Storybook para documentación de componentes
   - Componentes más complejos
   - Temas personalizados
   - Utilidades adicionales

## Problemas Comunes y Soluciones

1. **CSS no se carga**: Asegúrate de importar el archivo CSS en tu proyecto consumidor
2. **Errores de TypeScript**: Verifica que todas las dependencias estén correctamente instaladas y los tipos generados
3. **Errores de construcción**: Verifica que todas las dependencias externas estén listadas en `vite.config.ts`

## Recursos

- [Documentación de Vite](https://vitejs.dev/)
- [Documentación de Tailwind CSS](https://tailwindcss.com/)
- [Documentación de Shadcn/ui](https://ui.shadcn.com/)
- [Documentación de TypeScript](https://www.typescriptlang.org/)