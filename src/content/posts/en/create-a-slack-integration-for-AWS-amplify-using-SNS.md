---
title: 'Create a Slack integration for AWS Amplify using SNS'
pubDate: 2024-03-29
language: en
description: 'This is a post I made about why you should not use Create React App a couple of years ago. I still stand by this post today.'
# author: 'Kuro'
heroImage: ../../../images/blog/image.png
tags: ['react', 'create-react-app']
draft: true
layout: ../../../layouts/PostLayout.astro
---

Around September, 2022, I was working in a company that was starting to use React in their projects. I was a simple junior of the frontend team and we had to make a decision about the tools we were going to use in our projects.
I, as the junior, witnessed the conversation between the senior developers and the project manager, and I was surprised by the decision they were about to make.

They were going to use Create React App.

I was surprised because I had been reading a lot about the new tools that were being released and I knew that Create React App was not the best option for a production project.
Not only that, but the team itself was not aware of alternatives like Vite or Next.js and didn't even use it recently or in their personal projects.

Seeing this, I decided to write a letter to the project manager, explaining the great error they were about to make.

So I rescued that letter and I want to share it with you today.

This is the letter I wrote to the team. And the letter that changed the course of the project:

## Hey team.

In the past meeting we have discussed the frameworks that we are going to use in our projects, we need to talk more about it but there is something in particular that concerns me.

Once Create-React-App showed up, some opinions were that we could use it, as it has been tested before, but I think following this approach may result in more damage than benefits.

Why do I think this? Let me say a few examples.

First of all we have to make a simple question.

## What is CRA?

Although we (not only the company but us, developers as a community) have used CRA as an option to build single page apps even in production it doesn’t mean that we should it anymore.

Create React App was a new way to easily create a React project to learn how React works that was released 6 years ago and it has been updated since then. Currently there are more options that solves React problems in a much more modern way that wasn’t possible at the time.

![Docs of Create React app installation](/01/cra%20install.png)

Yes, CRA is “officially“ maintained by Facebook, but due to its legacy, it can't be supported the same way as its alternatives.

At this point you could be thinking,
“Well, CRA is a tool that works and that’s not enough reason for changing it.“
and that leads me to one of the stronger points.

## The React team does not recommend CRA for production

Some of you may know the React docs page. If you look around the website, you may notice it looks a bit old and not updated with today standards of React, as most of the examples are still written with Class Components and the hooks documentation hasn’t changed since a couple of years ago.

![Docs of Create React app installation](/01/react%20docs.png)

The React team is aware of this and they are working in a new docs website, written with hooks examples, and dedicating more content to detailing how React is used currently.

![Docs of Create React app installation](/01/newreactdocs.png)

In this new website, the idea of CRA being a learning tool is reinforced as we can see in the

“Start a new React project“ section, and even recommends us Vite or Parcel as alternatives.

![Docs of Create React app installation](/01/gettingstarted.png)

If we scroll down a little, we’ll reach the “Building with a full-featured framework“ section where the React teams recommends us to use Next.js instead if we are going to develop a full production application.

![Docs of Create React app installation](/01/buildingfullfeatures.png)

## CRA tries to make everything work

One of the downsides with the default installation with CRA, is that, just because is focused to be a learning boilerplate it is design to suit plenty of use cases, the project is filled with dependencies, polyfills… a bunch of js files that we don’t need.

The dependencies alone leaves a 300mb folder of node_modules out of the box, without installing anything else.

It also makes the develop experience much slower than it should be, comparing it to the faster Hot Module Replacement time, faster build time and <500ms for setting up the development environment that Vite offers.

With this, in my personal opinion, makes the project feel heavy and sometimes slow.

## The development time is longer with CRA

As we already know CRA does not provide anything out of the box that helps ups with the speed of development, the packages for styling, routing, (advanced) state can be freely chosen by the devs to choose. This is a good thing of course, but that means its basically the same as, for example a new project created with Vite, with the exception that Vite has better performance and less boilerplate, so there is no point in using CRA.

The migration from CRA to an alternative is an option to consider, but I strongly suggest not including it for any new project.

Thank you for your time.
