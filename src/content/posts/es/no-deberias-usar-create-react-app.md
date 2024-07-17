---
title: 'No deberías usar Create React App'
pubDate: 2024-03-29
description: 'Este es un post que hice hace un par de años sobre cómo no deberías usar create-react-app. Aún opino lo mismo a día de hoy.'
# author: 'Kuro'
language: es
image:
  url: 'https://docs.astro.build/assets/full-logo-light.png'
  alt: 'El logotipo completo de Astro.'
tags: ['react', 'create-react-app']
draft: false
layout: ../../../layouts/PostLayout.astro
---

Alrededor de septiembre de 2022, trabajaba en una empresa que empezaba a utilizar React en sus proyectos. Yo era un simple júnior del equipo de frontend y teníamos que tomar una decisión sobre las herramientas que íbamos a utilizar en nuestros proyectos.
Yo, como júnior, presencié la conversación entre los desarrolladores sénior y el jefe de proyecto, y me sorprendió la decisión que estaban a punto de tomar.

Iban a utilizar Create React App.

Me sorprendió porque había estado leyendo mucho sobre las nuevas herramientas que se estaban lanzando y sabía que Create React App no era la mejor opción para un proyecto en producción.
No solo eso, sino que el propio equipo no conocía alternativas como Vite o Next.js y ni siquiera las había utilizado recientemente o en sus proyectos personales.

Al ver esto, decidí escribir una carta al jefe de proyecto, explicando el gran error que estaban a punto de cometer.

Así que rescaté esa carta y quiero compartirla con vosotros hoy.

Esta es la carta que escribí al equipo. Y la carta que cambió el rumbo del proyecto:

## Hola equipo.

En la reunión pasada hemos hablado de los frameworks que vamos a utilizar en nuestros proyectos, necesitamos hablar más sobre ello pero hay algo en particular que me preocupa.

Una vez que se mencionó Create-React-App, algunas opiniones fueron que podríamos utilizarlo, ya que se ha probado antes, pero creo que seguir este enfoque puede resultar en más daños que beneficios.

¿Por qué pienso esto? Permitidme dar algunos ejemplos.

En primer lugar, tenemos que hacernos una pregunta sencilla.

## ¿Qué es CRA?

Aunque nosotros (no solo la empresa, sino nosotros, los desarrolladores como comunidad) hemos utilizado CRA como opción para crear aplicaciones de una sola página incluso en producción, no significa que debamos seguir haciéndolo.

Create React App fue una nueva forma de crear fácilmente un proyecto React para aprender cómo funciona React que se lanzó hace 6 años y se ha ido actualizando desde entonces. Actualmente hay más opciones que resuelven los problemas de React de una forma mucho más moderna que no era posible en aquel momento.

![Docs de la instalación de Create React app](/01/cra%20install.png)

Sí, CRA está "oficialmente" mantenido por Facebook, pero debido a su legado, no puede ser soportado de la misma manera que sus alternativas.

En este punto podríais estar pensando,
"Bueno, CRA es una herramienta que funciona y eso no es razón suficiente para cambiarla".
y eso me lleva a uno de los puntos más fuertes.

## El equipo de React no recomienda CRA para producción

Algunos de vosotros conoceréis la página de documentación de React. Si echáis un vistazo por la web, podréis notar que parece un poco antigua y no actualizada con los estándares actuales de React, ya que la mayoría de los ejemplos aún están escritos con Componentes de Clase y la documentación de hooks no ha cambiado desde hace un par de años.

![Docs de la instalación de Create React app](/01/react%20docs.png)

El equipo de React es consciente de esto y está trabajando en una nueva web de documentación, escrita con ejemplos de hooks, y dedicando más contenido a detallar cómo se utiliza React actualmente.

![Docs de la instalación de Create React app](/01/newreactdocs.png)

En este nuevo sitio web, se refuerza la idea de que CRA es una herramienta de aprendizaje, como podemos ver en la

sección "Start a new React project", e incluso nos recomienda Vite o Parcel como alternativas.

![Docs de la instalación de Create React app](/01/gettingstarted.png)

Si bajamos un poco, llegaremos a la sección "Building with a full-featured framework" donde el equipo de React nos recomienda usar Next.js en su lugar si vamos a desarrollar una aplicación completa para producción.

![Docs de la instalación de Create React app](/01/buildingfullfeatures.png)

## CRA intenta que todo funcione

Uno de los inconvenientes de la instalación por defecto de CRA es que, precisamente por estar enfocado a ser un boilerplate de aprendizaje, está diseñado para adaptarse a muchos casos de uso, el proyecto está lleno de dependencias, polyfills... un montón de archivos js que no necesitamos.

Solo las dependencias dejan una carpeta de 300mb de node_modules de serie, sin instalar nada más.

También hace que la experiencia de desarrollo sea mucho más lenta de lo que debería ser, comparándola con el tiempo de Hot Module Replacement más rápido, el tiempo de compilación más rápido y los <500ms para configurar el entorno de desarrollo que ofrece Vite.

Con esto, en mi opinión personal, hace que el proyecto se sienta pesado y a veces lento.

## El tiempo de desarrollo es más largo con CRA

Como ya sabemos, CRA no proporciona nada de serie que nos ayude con la velocidad de desarrollo, los paquetes para el estilo, el enrutamiento, el estado (avanzado) pueden ser elegidos libremente por los desarrolladores. Esto es algo bueno, por supuesto, pero significa que es básicamente lo mismo que, por ejemplo, un nuevo proyecto creado con Vite, con la excepción de que Vite tiene mejor rendimiento y menos boilerplate, así que no tiene sentido usar CRA.

La migración de CRA a una alternativa es una opción a considerar, pero sugiero encarecidamente no incluirlo en ningún proyecto nuevo.

Gracias por vuestro tiempo.
