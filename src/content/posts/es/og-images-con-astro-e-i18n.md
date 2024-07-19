---
title: 'Imágenes OpenGraph con Astro e i18n'
pubDate: 2024-07-19
description: 'Configuramos las imágenes Open Graph en Astro para que se adapten a los diferentes idiomas de nuestro sitio web.'
# author: 'Kuro'
language: es
heroImage: ../../../images/blog/astro_seo.png
keywords: ['astro', 'og-images', 'i18n', 'astro i18n', 'astro og images', 'astro open graph images', 'astro open graph images i18n', 'astro open graph images internationalization', 'astro multi lenguaje', 'astro traducciones', 'astro internacionalizacion' ]
image:
  url: 'https://docs.astro.build/assets/full-logo-light.png'
  alt: 'El logotipo completo de Astro.'
tags: ['astro', 'og-images', 'i18n']
draft: false
layout: ../../../layouts/PostLayout.astro
---

Como podras ver si pegas el link de esta publicación en twitter, este blog es multilingüe y las imágenes OpenGraph son diferentes para cada idioma. Esta es una gran característica para tener en un blog con varios idiomas, ya que permite tener una experiencia más personalizada para los lectores.

Sin embargo, mientras lo configuraba, descubrí que cualquier documentación o ejemplos al respecto eran terribles, quizás debido a la configuración en concreto de este proyecto, siendo Astro + i18n. Así que he decidido escribir esta publicación para ayudar a otros que puedan estar luchando con esto (y a mi yo futuro, por supuesto).
Puedes ver el resultado final viendo el [repositorio de GitHub de este blog](https://github.com/ikurotime/astro-portfolio-2023)

## Prerrequisitos

- `Un proyecto de Astro` *(obviamente)*
- `Plugin de React para Astro`
- `Satori, sharp y gray-matter`

- Satori: Convierte componentes React a imágenes SVG.
- Sharp: Biblioteca de procesamiento de imágenes para convertir SVG a PNG.
- Gray-Matter: Analiza el front-matter de archivos markdown.

Aqui lo tienes

```bash
npm install satori sharp gray-matter
```

Usaremos React solo para las imágenes OpenGraph, así que si aún no lo tienes, puedes añadirlo ejecutando:

```bash
npx astro add react
```

Trabajaré con archivos markdown para las entradas del blog.

## ¿Qué vamos a hacer?

Usando un componente de React, renderizaremos imágenes para cada una de nuestras entradas en el momento de la compilación. Es muy personalizable ya que puedes usar cualquier fuente e imagen de fondo que desees.

## Configurando tu proyecto

Para esta publicación, asumiré que tienes un conocimiento básico de Astro e i18n. Si no es así, te recomiendo que consultes la [documentación de Astro](https://docs.astro.build/) y la [documentación de i18n](https://docs.astro.build/en/recipes/i18n/)

Primero, necesitarás configurar i18n en tu proyecto. Puedes hacer esto siguiendo los pasos en la documentación de i18n.

Necesitarás actualizar el `astro.config.mjs` y añadir la información del sitio. Esto es necesario para más adelante, confía en mí.

```javascript
// astro.config.mjs
export default defineConfig({ 
  site:
  process.env.NODE_ENV === "development"
    ? "http://localhost:4321"
    : "https://davidhuertas.dev",
  integrations: [tailwind(), react()]
});
```

y también el archivo `package.json`. Explicaré que pasando aquí más adelante.

```json
  "scripts": {
    ...
    "build": "npm run build-setup && astro build && npm run kill-assets",
    "build-setup": "npm run serve-assets & npm run wait-for-assets",
    "serve-assets": "serve -p 3001 --no-port-switching ./src/images",
    "wait-for-assets": "wait-on -t 5000 http://localhost:3001/opengraph/background.png",
    "kill-assets": "kill-port 3001 || true"
    ...
  },
```

## Reestructuración del contenido de tu blog

Ahora, necesitaremos hacer algunos cambios en la estructura de carpetas de nuestro proyecto.

Primero, crearemos una carpeta llamada `content`, con la subcarpeta `posts`.

Dentro de `posts` crearemos una carpeta para cada idioma que queramos soportar. En mi caso, tengo dos idiomas: inglés y español. Así que tengo la siguiente estructura de carpetas:

```bash
src/
  content/
    posts/
      en/
        og-images-with-astro-and-i18n.md 
      es/
        og-images-con-astro-e-i18n.md # Esta publicación
    pages/
    config.ts # Definición de colecciones 
    ...
```

Si has seguido el tutorial de Astro para i18n, deberías tener una estructura similar a esta para la carpeta pages.

```bash
src/
  pages/
      en/
        index.astro
      es/
        index.astro
       index.astro
    ...
```
Lo actualizaremos para que se vea así:

> Nota: El archivo `og.png.ts` es el archivo que genera la imagen og para la publicación.

```bash
src/
  pages/
      [...lang]/posts/[...post]/
        [...slug].astro
        og.png.ts
    ...
      en/
        index.astro
      es/
        index.astro
       index.astro
    ...
```

## Preparar la plantilla de imagen OpenGraph

La imagen OpenGraph requerirá una imagen de fondo y alguna fuente para el texto. Crearemos una carpeta llamada `opengraph` dentro de la carpeta `pages`. Dentro de esta carpeta, crearemos una carpeta llamada `fonts` y una imagen de fondo.

Dentro de images, crearemos una carpeta `blog` con una imagen hero para cada entrada del blog.

La imagen de fondo necesita ser de `1920x1080` píxeles.

Las fuentes pueden ser cualquiera, yo usaré Inter, pero puedes usar cualquier fuente que te guste.
Puedes obtener las fuentes [aquí](https://github.com/ikurotime/astro-portfolio-2023/tree/main/src/images/opengraph/fonts)

```bash
src/
  pages/
    images/
        blog/  #Carpeta para cada imagen Hero de entrada del blog
          hero-vps.png
          react-logo.png
          ...
        opengraph/
          fonts/ #Fuentes para la imagen OpenGraph
          background.png #Imagen de fondo para la imagen OpenGraph
          ...
```

Crea un archivo `OG.tsx` dentro de la carpeta `components/OpenGraph`. Este archivo será la plantilla para la imagen OpenGraph.

```tsx
export default function OG(
  title: string = 'David Huertas - Software Engineer',
  heroImageURL: string
) {
  const basePath = 'http://localhost:3001/'
  const backgroundImageURL = `${basePath}opengraph/background.png`
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height: '100%',
        backgroundImage: `url(${backgroundImageURL})`,
        backgroundSize: 'cover',
        backgroundPosition: 'left',
        backgroundRepeat: 'no-repeat',
        alignItems: 'center',
        position: 'relative'
      }}
    >
      <h1
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: '1',
          padding: '2rem 4rem',
          fontSize: '4rem',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          fontWeight: 'bold',
          color: 'black',
          fontFamily: 'Inter',
          wordBreak: 'break-word'
        }}
      >
        {title}
      </h1>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: '1',
          margin: '2.5rem'
        }}
      >
        <img
          src={`${basePath}blog/${heroImageURL}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '24px'
          }}
        />
      </div>
    </div>
  )
}
```

Añade un archivo `createImage.ts` dentro de la misma carpeta. Este archivo convertirá el componente React a una imagen SVG y luego a una imagen PNG.

```tsx
import fs from 'fs/promises'
import satori from 'satori'
import sharp from 'sharp'

export async function SVG(component: JSX.Element) {
  return await satori(component, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'Inter',
        data: await fs.readFile(
          './src/images/opengraph/fonts/Inter-Regular.ttf' //Puedes usar cualquier fuente que te guste.
        ),
        weight: 400
      },
      {
        name: 'Inter',
        data: await fs.readFile(
          './src/images/opengraph/fonts/Inter-ExtraBold.ttf'
        ),
        weight: 800
      }
    ]
  })
}

export async function PNG(component: JSX.Element) {
  return await sharp(Buffer.from(await SVG(component)))
    .png()
    .toBuffer()
}
```

## Creando la imagen OpenGraph

Mira este `.md` de ejemplo

```yaml
---
title: 'Deploy docker containers in VPS with Github Actions'
pubDate: 2024-07-18
language: en
description: 'How to make a CI/CD pipeline to deploy Docker containers in a VPS with Github Actions'
author: 'Kuro'
heroImage: ../../../images/blog/hero-vps.png
tags: ['VPS', 'Docker', 'Github Actions','CI/CD']
layout: ../../../layouts/PostLayout.astro
draft: false
---
```
Es importante tener todos sus parámetros definidos en el archivo `src/content/config.ts`.

```typescript
import { defineCollection, z } from 'astro:content'

const postCollection = defineCollection({
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.date(),
      draft: z.boolean(),
      tags: z.array(z.string()),
      language: z.string(),
      heroImage: image().refine((img) => img.width >= 1080, {
        message: 'Cover image must be at least 1080 pixels wide!'
      })
    })
})

export const collections = {
  posts: postCollection,
}
```

Ahora, crearemos el archivo `og.png.ts` dentro de la carpeta `[...lang]/posts/[...post]`. Este archivo generará la imagen OpenGraph para la publicación:

Este es mi archivo, adáptalo a tus necesidades.
```typescript
import type { APIRoute, InferGetStaticPropsType } from 'astro'

import OG from '../../../../components/OpenGraph/OG'
import { PNG } from '../../../../components/OpenGraph/createImage'
import fs from 'fs/promises'
import { getCollection } from 'astro:content'
import matter from 'gray-matter'

export async function getStaticPaths() {
  const blog = await getCollection('posts')
  const blogData = await getBlogFrontmatterCollection()
  return blog.map((post) => {
    const postData = blogData.find((data) => data.title === post.data.title)
    return {
      params: {
        lang: post.slug.split('/').shift(),
        post: post.slug.split('/').pop()
      },
      props: {
        title: post.data.title,
        heroImage: postData?.heroImage?.replace('../../../images/blog/', '')
      }
    }
  })
}

type Props = InferGetStaticPropsType<typeof getStaticPaths>

export const GET: APIRoute = async function get({ props, params }) {
  const { title, heroImage } = props as Props
  const png = await PNG(OG(title, heroImage))
  return new Response(png, {
    headers: {
      'Content-Type': 'image/png'
    }
  })
}

const getBlogFrontmatterCollection = async () => {
  const contentDirs = ['src/content/posts/en', 'src/content/posts/es']
  const getFrontmatter = async (dir: string) => {
    const files = await fs.readdir(dir)
    return Promise.all(
      files
        .filter((file) => file.endsWith('.md'))
        .map(async (file) => {
          const content = await fs.readFile(`${dir}/${file}`, 'utf-8')
          return matter(content).data
        })
    )
  }

  const frontmatterPromises = contentDirs.map(getFrontmatter)
  const frontmatterCollections = await Promise.all(frontmatterPromises)

  return frontmatterCollections.flat()
}

```

Ahora deberías poder compilar tu proyecto. Con el script personalizado, los archivos de imagen se generarán en tiempo de ejecución y se servirán localmente.

## Usando la imagen OpenGraph en tu entrada de blog

Crea un componente `Head.astro` en la carpeta `components`.

```astro
---
interface Props {
  title: string
  description: string
}
const { title, description } = Astro.props as Props
const permalink = new URL(Astro.url.pathname, Astro.site).href //¿Ves? Te dije que lo necesitaríamos
const ogImageURL = permalink + '/og.png'
---

<head>
  <!-- Etiquetas Meta Primarias -->
  <title>{title}</title>
  <meta name='title' content={title} />
  <meta name='description' content={description} />

  <!-- El resto del contenido de tu head -->

  <!-- Open Graph / Facebook -->
  <meta property='og:type' content='website' />
  <meta property='og:url' content={permalink} />
  <meta property='og:title' content={title} />
  <meta property='og:description' content={description} />
  <meta property='og:image' content={ogImageURL} />

  <!-- Twitter -->
  <meta property='twitter:card' content='summary_large_image' />
  <meta property='twitter:url' content={permalink} />
  <meta property='twitter:title' content={title} />
  <meta property='twitter:description' content={description} />
  <meta property='twitter:image' content={ogImageURL} />
</head>
```

Tengo un archivo PostLayout.astro que uso para el diseño de las entradas del blog, así que puedo importar fácilmente el componente Head y pasarle el título y la descripción.

Con esta configuración, en el momento de la compilación, la imagen OpenGraph se guardará con cada post

![Directorio de trabajo](/03/build_astro.png)

## Disfruta de tus nuevas imágenes OpenGraph

¡Eso es todo! Ahora tienes una imagen OpenGraph personalizada para cada entrada del blog en tu blog multilingüe. Esto te ayudará a tener un mejor SEO y una experiencia más personalizada para tus lectores.

Como puedes ver, la configuración es un poco compleja, pero vale la pena. Si tienes alguna pregunta, no dudes en preguntarme en Twitter al respecto.

Recuerda que puedes ver el resultado final viendo el [repositorio de GitHub de este blog](https://github.com/ikurotime/astro-portfolio-2023)