---
title: 'Deploy docker containers in VPS with Github Actions'
pubDate: 2024-04-13
language: en
description: 'This is a post I made about why you should not use Create React App a couple of years ago. I still stand by this post today.'
author: 'Kuro'
image:
  url: 'https://docs.astro.build/assets/full-logo-light.png'
  alt: 'El logotipo completo de Astro.'
tags: ['astro', 'bloguear', 'aprender en público']
layout: ../../../layouts/PostLayout.astro
draft: true
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

