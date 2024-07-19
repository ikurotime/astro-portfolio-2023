---
title: 'Deploy docker containers in VPS with Github Actions'
pubDate: 2024-07-18
language: en
description: 'How to make a CI/CD pipeline to deploy Docker containers in a VPS with Github Actions'
author: 'Kuro'
heroImage: ../../../images/blog/hero-vps.png
image:
  url: 'https://docs.astro.build/assets/full-logo-light.png'
  alt: 'El logotipo completo de Astro.'
tags: ['VPS', 'Docker', 'Github Actions','CI/CD']
layout: ../../../layouts/PostLayout.astro
draft: false
---

We all love Docker, and if you don't, you should. 

Docker is a great tool that allows us to create containers with our applications and run them in any environment. But what if we want to deploy our containers in a VPS? In this post, I will show you how to deploy your Docker containers in a VPS using Github Actions.

## What are we going to do?

We are going to build a simple workflow that will allow us to deploy our custom images to [github container registry](https://github.com/features/packages), pull them from our VPS and run them.


Esentially, this will be just like having a simple CI/CD pipeline.

![Canvas drawing of workflow](/02/workflow.png)
*Figure 1: Workflow diagram example of the CI/CD pipeline*

## Prerequisites

Before we start, you need to have the following:
- A VPS with Docker installed
- A Github repository with your app

## Step 1: Select a Github repository

You can either create a new repo or use an existing one. For this example, I will use a simple Node.js app.

We will use the [Hono](https://hono.dev/) framework. You can install it by running:

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
// Response from http://localhost:3000/
$> node index.js
Hello Node.js!
```

Here is the folder structure until now:

```bash
.
├── node_modules/ 
├── index.js
├── package-lock.json
└── package.json
```

## Step 2: Create a Dockerfile

In the root of your project, create a new file called `Dockerfile` and add the following content:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json .
COPY index.js .

RUN npm install 

CMD ["node", "index.js"]
```
> If you are using an M1 Mac or similar you will need to add the `--platform linux/amd64` flag to the Dockerfile
```dockerfile
FROM --platform linux/amd64 node:18-alpine
...
```
This file will create a new image based on the `node:18-alpine` image, install the dependencies of your app and then run it.

Now we can build the image by running:

```bash
docker build -t vps_tutorial .
```
And run it with:

```bash
docker run -d -p 3000:3000 vps_tutorial
```

If we go to `http://localhost:3000/` we should see the message `Hello Node.js!`. Awesome!


![Image of server running](/02/docker_run.png)
*Figure 2: Server working as expected*

## Step 3: Get Secrets and SSH keys

We need to get some secrets to make this work. I'll explain it in a bit

- `GH_SECRET`
- `SSH_USER`
- `SSH_HOST`
- `SSH_PRIVATE_KEY`
- `WORK_DIR` 

Now we need to get a Github API key. This will allow the Github Action Workflow to push our image to the Github Container Registry.

On Github, go to `Settings` -> `Developer settings` -> `Personal access tokens` and click on `Generate new token`. Select the `write:packages` scope and click on `Generate token`.

Here's a shortcut to the page:

[https://github.com/settings/tokens/new?scopes=write:packages,read:packages,delete:packages](https://github.com/settings/tokens/new?scopes=write:packages,read:packages,delete:packages)

I will generate a Classic Token, this will be our `GH_SECRET`.

For the next step, we need to get the SSH private key of our VPS.
You will need to create a new user for the Github actions if you don't have one already. You can user whatever user you like, of course.

The user will be our `SSH_USER`.
The ip address of your VPS will be our `SSH_HOST`.
The directory where you want to deploy your app will be our `WORK_DIR`.

Log into your VPS.
Then, generate one by running:

```bash
ssh-keygen -t rsa -b 4096
```

Copy the content of the public key and add it to the `~/.ssh/authorized_keys` file of the user you want to use.

`cat <path/to/public/key> >> ~/.ssh/authorized_key`

Now, copy the content of the *private* key to a new file.
  
```bash
cat <path/to/private/key>
```
This will be our `SSH_PRIVATE_KEY`.
> Note that the public key will be the one with the `.pub` extension. The private key will be the one without it.



Now that we have all the secrets, we can set the secrets in our Github repository.

Go to the repo `Security` -> `Secrets and Variables` -> Actions and click on `New repository secret`. Add the secrets with the names mentioned above.
![Github Secrets](/02/github_config.png)

## Step 4: Create a Github Actions workflow

In your Github repository, create a new folder called `.github/workflows` and add a new file called `docker-publish.yml`.

```yaml
name: publish

on:
  push:
    branches: ['main']

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.actor }}/<image-name>:latest # Change <image-name> to your image name

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

The workflow will trigger on every push to the `master` branch. It will build the image, push it to the Github Container Registry, and then log into the VPS, pull the image and run it.

## Step 6: Upload the image to Github Container Registry

We are almost ready, but first, we need to generate the image and push it to the Github Container Registry so the workflow can pull it.

1. Export the `GH_SECRET` variable in your terminal:
```bash
export GH_SECRET=<GH_SECRET>
```
2. Login to the container registry:
```bash
echo $GH_SECRET | docker login ghcr.io -u <username> --password-stdin
```
3. Build and push the image:
```bash
docker build . -t ghcr.io/<username>/<image-name>:latest && docker push ghcr.io/<username>/<image-name>:latest
  ```
The image will be pushed to the Github Container Registry.

In your server, you will need to repeat the steps 1 and 2 so the server can pull the image.

## Step 7: Run the image on your server

Create a new file called `docker-compose.yml` in the same route as the `WORK_DIR`:

```yaml
version: '3.7'
services: # Add more services if needed
  <name>:
    container_name: <name> # Change this to your container name
    image: ghcr.io/{username}/<image>:latest
    ports:
      - 3000:3000
```

After creating the file, build the container by running:

```bash
docker compose up -d
```

Congratulations! You have successfully deployed your Docker container to your VPS using Github Actions!

Now everytime you push to the `main` branch, the workflow will trigger and deploy the new image to your VPS.

Here is a link to the full repository if you want to check it out:

[https://github.com/ikurotime/vps_github_actions_tutorial](https://github.com/ikurotime/vps_github_actions_tutorial)