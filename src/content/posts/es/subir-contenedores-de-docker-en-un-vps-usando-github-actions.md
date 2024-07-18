---
title: 'Subir contentedores de docker en un VPS con Github Actions'
pubDate: 2024-07-18
description: 'Cómo hacer un pipeline de CI/CD para subir contenedores de Docker a un VPS con Github Actions'
author: 'Kuro'
language: es
image:
  url: 'https://docs.astro.build/assets/full-logo-light.png'
  alt: 'El logotipo completo de Astro.'
tags: ['VPS', 'Docker', 'Github Actions','CI/CD']
layout: ../../../layouts/PostLayout.astro
draft: false
---

We all love Docker, and if you don't, you should. 

Docker is a great tool that allows us to create containers with our applications and run them in any environment. But what if we want to deploy our containers in a VPS? Too complicated? Not at all! In this post, I will show you how to deploy your Docker containers in a VPS using Github Actions.

## What are we going to build?

We are going to build a simple workflow that will allow us to deploy our custom images to github container registry, pull them from our VPS and run them.

Esentially, this will be just like having a simple CI/CD pipeline.

![Canvas drawing of workflow](/02/workflow.png)

## Prerequisites

Before we start, you need to have the following:
- A VPS with Docker installed
- A Github repository with your app

