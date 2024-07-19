---
title: 'Subir contentedores de docker en un VPS con Github Actions'
pubDate: 2024-07-18
description: 'Cómo hacer un pipeline de CI/CD para subir contenedores de Docker a un VPS con Github Actions'
author: 'Kuro'
language: es
heroImage: "../../../images/blog/hero-vps.png"
keywords: ['Docker', 'VPS', 'Github Actions', 'CI/CD', 'Docker en VPS', 'Github Actions Docker', 'Docker Github Actions', 'Docker VPS', 'Docker en VPS con Github Actions', 'Docker en VPS con CI/CD', 'Docker en VPS con Github Actions CI/CD', 'Docker en servidor con Github Actions', 'Docker en servidor con CI/CD', 'Docker en servidor con Github Actions CI/CD']
image:
  url: 'https://docs.astro.build/assets/full-logo-light.png'
  alt: 'El logotipo completo de Astro.'
tags: ['VPS', 'Docker', 'Github Actions','CI/CD']
layout: ../../../layouts/PostLayout.astro
draft: false
---
A todos nos encanta Docker, y tu también deberías.

Docker es una herramienta fantástica que nos permite crear contenedores con nuestras aplicaciones y ejecutarlos en cualquier entorno. Pero, ¿y si queremos desplegar nuestros contenedores en un VPS (Virtual Private Server, o Servidor privado virtual)? En este artículo, te mostraré cómo desplegar tus contenedores Docker en un VPS utilizando Github Actions.

## ¿Qué vamos a hacer?

Vamos a crear un flujo de trabajo sencillo que nos permitirá desplegar nuestras imágenes personalizadas en el [registro de contenedores de Github](https://github.com/features/packages), descargarlas desde nuestro VPS y ejecutarlas.

Esencial,ente, esto será como tener un pipeline simple de CI/CD.

![Dibujo en lienzo del flujo de trabajo](/02/workflow.png)
*Figura 1: Ejemplo de diagrama de flujo del pipeline CI/CD*

## Requisitos previos

Antes de empezar, necesitas tener lo siguiente:
- Un VPS con Docker instalado
- Un repositorio de Github con tu aplicación

## Paso 1: Selecciona un repositorio de Github

Puedes crear un nuevo repositorio o utilizar uno existente. Para este ejemplo, utilizaré una aplicación sencilla de Node.js.

Utilizaremos el framework [Hono](https://hono.dev/). Puedes instalarlo ejecutando:

```bash
npm install hono @hono/node-server
```

```javascript
// index.js
import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => c.text('Hello Node.js!'))

console.log("Server started!")
serve(app)
```
```console
// Respuesta de http://localhost:3000/
$> node index.js
Hello Node.js!
```

Aquí tienes la estructura de carpetas hasta ahora:

```bash
.
├── node_modules/ 
├── index.js
├── package-lock.json
└── package.json
```

## Paso 2: Crea un Dockerfile

En la raíz de tu proyecto, crea un nuevo archivo llamado `Dockerfile` y añade el siguiente contenido:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json .
COPY index.js .

RUN npm install 

CMD ["node", "index.js"]
```
> Si estás utilizando un Mac M1 o similar, necesitarás añadir la bandera `--platform linux/amd64` al Dockerfile
```dockerfile
FROM --platform linux/amd64 node:18-alpine
...
```
Este archivo creará una nueva imagen basada en la imagen `node:18-alpine`, instalará las dependencias de tu aplicación y luego la ejecutará.

Ahora podemos construir la imagen ejecutando:

```bash
docker build -t vps_example .
```
Y ejecutarla con:

```bash
docker run -d -p 3000:3000 vps_example
```

Si vamos a `http://localhost:3000/` deberíamos ver el mensaje `Hello Node.js!`. ¡Genial!

![Imagen del servidor en funcionamiento](/02/docker_run.png)
*Figura 2: El servidor funciona según lo esperado*

## Paso 3: Obtén los Secretos y las claves SSH

Necesitamos obtener algunos secretos para que esto funcione. Lo explicaré en un momento

- `GH_SECRET`
- `SSH_USER`
- `SSH_HOST`
- `SSH_PRIVATE_KEY`
- `WORK_DIR` 

Ahora necesitamos obtener una clave API de Github. Esto permitirá que el Flujo de Trabajo de Github Actions envíe nuestra imagen al Registro de Contenedores de Github.

En Github, ve a `Configuración` -> `Configuración de desarrollador` -> `Tokens de acceso personal` y haz clic en `Generar nuevo token`. Selecciona el ámbito `write:packages` y haz clic en `Generar token`.

Aquí tienes un acceso directo a la página:

[https://github.com/settings/tokens/new?scopes=write:packages,read:packages,delete:packages](https://github.com/settings/tokens/new?scopes=write:packages,read:packages,delete:packages)

Generaré un Token Clásico, este será nuestro `GH_SECRET`.

Para el siguiente paso, necesitamos obtener la clave privada SSH de nuestro VPS.
Tendrás que crear un nuevo usuario para las Github Actions si aún no tienes uno. Por supuesto, puedes usar el usuario que quieras.

El usuario será nuestro `SSH_USER`.
La dirección IP de tu VPS será nuestro `SSH_HOST`.
El directorio donde quieres desplegar tu aplicación será nuestro `WORK_DIR`.

Inicia sesión en tu VPS.
Luego, genera una clave ejecutando:

```bash
ssh-keygen -t rsa -b 4096
```

Copia el contenido de la clave pública y añádelo al archivo `~/.ssh/authorized_keys` del usuario que quieres utilizar.

`cat <ruta/a/la/clave/pública> >> ~/.ssh/authorized_key`

Ahora, copia el contenido de la clave *privada* a un nuevo archivo.
  
```bash
cat <ruta/a/la/clave/privada>
```
Esta será nuestra `SSH_PRIVATE_KEY`.
> Ten en cuenta que la clave pública será la que tenga la extensión `.pub`. La clave privada será la que no la tenga.

Ahora que tenemos todos los secretos, podemos configurarlos en nuestro repositorio de Github.

Ve a `Seguridad` del repositorio -> `Secretos y Variables` -> Acciones y haz clic en `Nuevo secreto del repositorio`. Añade los secretos con los nombres mencionados anteriormente.
![Secretos de Github](/02/github_config.png)

## Paso 4: Crea un flujo de trabajo de Github Actions

En tu repositorio de Github, crea una nueva carpeta llamada `.github/workflows` y añade un nuevo archivo llamado `docker-publish.yml`.

```yaml
name: publish

on:
  push:
    branches: ['main']

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.actor }}/<nombre-imagen>:latest # Cambia <nombre-imagen> por el nombre de tu imagen

jobs:
  publish:
    name: publish image
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - name: Login
        run: |
          echo ${{ secrets.GH_SECRET }} | docker login ghcr.io -u ${{ github.actor }} --password-stdin
      - name: Build and Publish
        run: |
          docker build . --tag ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          docker push ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}

  deploy:
    needs: publish
    name: deploy image
    runs-on: ubuntu-latest

    steps:
      - name: install ssh keys
        run: |
          install -m 600 -D /dev/null ~/.ssh/id_rsa
          echo "${{ secrets.SSH_PRIVATE_KEY }}" > ~/.ssh/id_rsa
          ssh-keyscan -H ${{ secrets.SSH_HOST }} > ~/.ssh/known_hosts
      - name: connect and pull
        run: ssh ${{ secrets.SSH_USER }}@${{ secrets.SSH_HOST }} "cd ${{ secrets.WORK_DIR }} && docker compose pull && docker compose up -d && exit"
      - name: cleanup
        run: rm -rf ~/.ssh
```

El flujo de trabajo se activará en cada push a la rama `master`. Construirá la imagen, la enviará al Registro de Contenedores de Github, y luego iniciará sesión en el VPS, descargará la imagen y la ejecutará.

## Paso 6: Sube la imagen al Registro de Contenedores de Github

Ya casi estamos listos, pero primero necesitamos generar la imagen y subirla al Registro de Contenedores de Github para que el flujo de trabajo pueda descargarla.

1. Exporta la variable `GH_SECRET` en tu terminal:
```bash
export GH_SECRET=<GH_SECRET>
```
2. Inicia sesión en el registro de contenedores:
```bash
echo $GH_SECRET | docker login ghcr.io -u <nombre-usuario> --password-stdin
```
3. Construye y sube la imagen:
```bash
docker build . -t ghcr.io/<nombre-usuario>/<nombre-imagen>:latest && docker push ghcr.io/<nombre-usuario>/<nombre-imagen>:latest
  ```
La imagen se subirá al Registro de Contenedores de Github.

En tu servidor, tendrás que repetir los pasos 1 y 2 para que el servidor pueda descargar la imagen.

## Paso 7: Ejecuta la imagen en tu servidor

Crea un nuevo archivo llamado `docker-compose.yml` en la misma ruta que el `WORK_DIR`:

```yaml
version: '3.7'
services: # Añade más servicios si es necesario
  <nombre>:
    container_name: <nombre> # Cambia esto por el nombre de tu contenedor
    image: ghcr.io/{nombre-usuario}/<imagen>:latest
    ports:
      - 3000:3000
```

Después de crear el archivo, construye el contenedor ejecutando:

```bash
docker compose up -d
```

¡Enhorabuena! ¡Has desplegado con éxito tu contenedor Docker en tu VPS utilizando Github Actions!

Ahora, cada vez que hagas push a la rama `main`, el flujo de trabajo se activará y desplegará la nueva imagen en tu VPS.

Aquí tienes un enlace al repositorio completo si quieres echarle un vistazo:

[https://github.com/ikurotime/vps_github_actions_tutorial](https://github.com/ikurotime/vps_github_actions_tutorial)

