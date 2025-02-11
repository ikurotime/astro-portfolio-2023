---
title: 'Despliegues a VPS listos para producción.'
pubDate: 2024-09-16
description: 'Cómo configurar un VPS para desplegar aplicaciones en producción.'
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
Vamos a montar un servidor donde poder subir todos nuestros proyectos. Podremos subir proyectos con cualquier lenguaje y además se subirán automáticamente al subir código, justo como en Vercel.

Existen herramientas que te permiten replicar funcionamientos similares como [coolify](ify.io/docs/introduction). Pero vamos a construirlo nosotros.

## Comprar y configurar el VPS

Vamos a comprar nuestro VPS en https://contabo.com/en/, pero puedes usar Heztner, Digital Ocean o cualquier proveedor que prefieras.

Nuestro único requisito va a ser, instalar Ubuntu 20.
Una vez tengamos la dirección IP y nuestra contraseña, podemos acceder por ssh a nuestro server

![Screenshot 2024-09-12 at 13.52.33.png](/04/contabo.png)

### Generar nuestras claves privadas

Vamos a generar unas claves ssh para nuestro servidor con el siguiente comando

```bash
ssh-keygen -t ed25519 -C "tucódigosecreto"
```

![Screenshot 2024-09-12 at 14.12.16.png](/04/cert.png)

### Crear un usuario

Es altamente recomendable crear un usuario nuevo en lugar de usar el root asi que vamos a hacerlo.

```bash
$ adduser afor
```

![Screenshot 2024-09-12 at 14.17.44.png](/04/user.png)

Después vamos a darle privilegios de sudo al usuario que acabamos de crear

```bash
// Damos privilegios de sudo
usermod -aG sudo afor
// Cambiamos a ese usuario
su - afor
// Lanzamos un comando sudo
sudo ls /
```

![Screenshot 2024-09-12 at 14.21.31.png](/04/sudo.png)

## Configurar un dominio para nuestro VPS

Como todo servidor, podemos asignar un DNS a nuestro nuevo vps.
Para ello tenemos que comprar el dominio de nuestra elección y en la configuarción de DNS.
Añadir un registro “A” con la dirección IP de nuestro servidor. 
Una vez se propague, nuestro dominio, resolverá a nuestro DNS.

### Deshabilitar contraseña

Una vez tenemos la clave, la tenemos que registrar en el servidor

```bash
shh-copy-id afor@[IP]
```

![Screenshot 2024-09-12 at 15.04.44.png](/04/sshcopy.png)

al introducir nuestro phrase, podremos conectarnos otra vez.

## Deshabilitar Conexión por Password

Para deshabilitarlo tenemos que modificar la configuración de ssh.

```bash
sudo vim /etc/ssh/sshd_config
```

Yo uso vim, pero puedes usar el editor que quieras

Buscamos las siguientes lineas y las dejamos asi:

```bash
# To disable tunneled clear text passwords, change to no here!
PasswordAuthentication no
...
PermitRootLogin no
...
UsePAM no
// Una vez hecho, reiniciamos el servicio de ssh
$> sudo systemctl restart ssh
// Y probamos a conectarnos otra vez (en otra ventana de terminal
// deja la conexión abierta por si acaso!)
```

Si hemos hecho todo bien, solo deberíamos poder acceder con el usuario y passphrase que hemos creado.

## Comprobando la conexión de nuestro VPS.

Vamos a utilizar un proyecto de react + vite como ejemplo. Ahora que tenemos configurado algunas cosas deberemos instalar lo necesario para levantar nuestros proyectos aunque sea en modo de desarrollo.

Una vez instalado podemos levantar el proyecto como `pnpm dev --host` . Enfasis a este último parámetro, ya que necesitamos que el proyecto se pueda comunicar con el resto de la red.

Si. en el navegador accedemos a la dirección de nuestra ip (o dominio) y el puerto en cuestión, veremos cómo se visualiza.

Pero esto es el entorno de desarrollo, no es lo que deberíamos hacer. 
Ahora es cuando toca Dockerizar nuestra app.

```yaml
services:
  askfor:
    image: ghrc.io/afordigital/askfor:prod #La imagen de tu app
		ports:
				- "5173:5173"
```

## Protegiendo las solicitudes y puertos del VPS

Los únicos puertos que nos interesan, son el 22 para el ssh, 80 para http y 443 para https por si habilitamos un dominio con SSL.

Para ello utilizaremos un firewall, Uncomplicated Firewall / UFW, que además está incluido en Ubuntu.

Primero vamos a deshabilitar todo el trafico entrante que le llegue al VPS y habilitar trafico saliente.

```bash
$> sudo ufw default deny incoming 
$> sudo ufw default allow outgoing 
```

![Screenshot 2024-09-12 at 17.07.08.png](/04/ufw.png)

Después tenemos que habilitar la conexión a OpenSSH, para poder seguir entrando a nuestro server.
Esto es muy importante, porque nos podemos quedar bloqueados si no lo hacemos y habria que reiniciar el servidor y empezar de cero si no tienes copias de seguridad.
Para ello introducimos el siguiente comando

```bash
$> sudo ufw allow OpenSSH
```

Una vez hecho esto, podemos listar las reglas que hemos añadido, habilitarlo y comprobar el estado del firewall

```bash
$> sudo ufw show added
$> sudo ufw enable
$> sudo ufw status
```

![Screenshot 2024-09-12 at 17.13.33.png](/04/ufwstatus.png)

Al hacer esto, ningún puerto estará expuesto, salvo los que explicitamente indiquemos en un dockerfile o compose.yml. Pero esto no es deseable.
Lo solucionaremos con un reverse proxy, que será lo único que estará expuesto a internet y se encargará de redirigir el tráfico.
Se pueden utilizar opciones como Nginx, pero utilizaré Traefic.

```yaml
services:
  reverse-proxy:
    image: traefik:v3.1
    command:
        - "--api.insecure=true"
        - "--providers.docker"
    ports:
        - "80:80"
        - "8080:8080"
    volumes:
        - /var/run/docker.sock:/var/run/docker.sock
  askfor:
    image: ghcr.io/afordigital/askfor:prod
    labels:
        - "traefik.http.routers.askfor.rule=Host(`109.199.113.155`)"
```

> Nota como no necesitamos declarar los puertos de nuestro proyecto, Traefic se encargará de ello
> 

Después de levantar el contenedor con `docker compose up` habilitaremos los puertos correspondientes

```bash
$> sudo ufw allow 80
$> sudo ufw allow 8080
```

## Réplicas del contenedor

Podemos hacer un pequeño load balancer si establecemos las réplicas en el yaml.

```yaml
services:
  reverse-proxy:
    image: traefik:v3.1
    command:
        - "--api.insecure=true"
        - "--providers.docker"
    ports:
        - "80:80"
        - "8080:8080"
    volumes:
        - /var/run/docker.sock:/var/run/docker.sock
  askfor:
    image: ghcr.io/afordigital/askfor:prod
    labels:
        - "traefik.http.routers.askfor.rule=Host(`109.199.113.155`)"
    deploy:
        mode: replicated
        replicas: 3
```

Esto hará que las solicitudes se repartan entre la cantidad de replicas que creemos

## CI / CD

Ya he escrito sobre como hacer CI/CD con Github Actions en [otro post](https://davidhuertas.dev/es/posts/subir-contenedores-de-docker-en-un-vps-usando-github-actions/). 

Pero recientemente he descubierto que hay algunas imagenes de docker que pueden encargarse de esto. Uno de ellos es watchtower. Monitorizará los contenedores que tengamos en nuestro servidor y si hay una nueva versión, la descargará y reiniciará el contenedor.

```yaml
services:
  watchtower:
    image: containrrr/watchtower
    command:
		    - "--rolling-restart"
		    - "--label-enable"
		    - "--interval"
		    - "30"
		volumes:
				- /var/run/docker.sock:/var/run/docker.sock
  reverse-proxy:
    image: traefik:v3.1
    command:
        - "--api.insecure=true"
        - "--providers.docker"
    ports:
        - "80:80"
        - "8080:8080"
    volumes:
        - /var/run/docker.sock:/var/run/docker.sock
  askfor:
    image: ghcr.io/afordigital/askfor:prod
    labels:
        - "traefik.http.routers.askfor.rule=Host(`109.199.113.155`)"
        - "com.centurylinklabs.watchtower.enable=tru
    deploy:
        mode: replicated
        replicas: 3
```