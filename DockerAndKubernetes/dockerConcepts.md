# What is docker?

Docker is an open source [containerization](https://www.ibm.com/cloud/learn/containerization) platform. It enables developers to package applications into containers—standardized executable components combining application source code with the operating system (OS) libraries and dependencies required to run that code in any environment. Containers simplify delivery of distributed applications, and have become increasingly popular as organizations shift to cloud-native development and hybrid [multicloud](https://www.ibm.com/cloud/learn/multicloud) environments.

Developers can create containers without Docker, but the platform makes it easier, simpler, and safer to build, deploy and manage containers. Docker is essentially a toolkit that enables developers to build, deploy, run, update, and stop containers using simple commands and work-saving automation through a single API.

Docker also refers to [Docker, Inc.](https://www.docker.com/company) (link resides outside IBM), the company that sells the commercial version of Docker, and to the [Docker open source project ](https://github.com/docker)(link resides outside IBM), to which Docker, Inc. and many other organizations and individuals contribute.

## Virtual machine vs Docker

![img](https://i1.wp.com/www.docker.com/blog/wp-content/uploads/Blog.-Are-containers-..VM-Image-1-1024x435.png?ssl=1)

## Benefits of docker:

- Runs container in seconds instead of minutes
- Less resources results less disk space
- Uses less Memory
- Does not need full OS
- Deployment
- Testing

## What is a Docker Image? 

 A **Docker image** is an immutable (unchangeable) file  that contains the source code, libraries, dependencies, tools, and other files needed for an application to run.  Due to their **read-only** quality, these images are  sometimes referred to as snapshots. They represent an application and  its virtual environment at a specific point in time. This consistency is one of the great features of Docker. It allows developers to test and  experiment software in stable, uniform conditions.  Since images are, in a way, just **templates**, you  cannot start or run them. What you can do is use that template as a base to build a container. **A container is, ultimately, just a running image.** Once you create a container, it adds a writable layer on top of the  immutable image, meaning you can now modify it.  The image-based on which you create a container exists separately and cannot be altered. When you run a [containerized environment](https://phoenixnap.com/kb/how-to-containerize-applications), you essentially create a **read-write copy** of that filesystem (docker image) inside the container. This adds a **container layer** which allows modifications of the entire copy of the image.

![Brief explanation of Container Layer and Image layer](https://phoenixnap.com/kb/wp-content/uploads/2021/04/container-layers.png)

## What is a container?

A **Docker container** is a virtualized run-time environment where users can isolate  applications from the underlying system. These containers are compact,  portable units in which you can start up an application quickly and  easily.  A valuable feature is the **standardization** of the  computing environment running inside the container. Not only does it  ensure your application is working in identical circumstances, but it  also simplifies sharing with other teammates.  As containers are autonomous, they provide strong isolation, ensuring they do not interrupt other running containers, as well as the server  that supports them. Docker claims that these units “provide the  strongest isolation capabilities in the industry”. Therefore, you won’t  have to worry about keeping your machine **secure** while developing an application.  Unlike virtual machines (VMs) where virtualization happens at the  hardware level, containers virtualize at the app layer. They can utilize one machine, share its kernel, and virtualize the operating system to  run isolated processes. This makes containers extremely **lightweight**, allowing you to retain valuable resources.

![The difference in structure between containers and virtual machines](https://phoenixnap.com/kb/wp-content/uploads/2021/04/container-vs-virtual-machine.png)

## Common commands:

![image-20210714075424093](C:\Users\gmalarski\AppData\Roaming\Typora\typora-user-images\image-20210714075424093.png)

![image-20210714075443208](C:\Users\gmalarski\AppData\Roaming\Typora\typora-user-images\image-20210714075443208.png)

![image-20210714075646644](C:\Users\gmalarski\AppData\Roaming\Typora\typora-user-images\image-20210714075646644.png)

"d" - means detached mode

## Exposing Port:

![image-20210714080646914](C:\Users\gmalarski\AppData\Roaming\Typora\typora-user-images\image-20210714080646914.png)

```bash
docker run -d -p 8080:80 nginx:latest
```

port localhost:8080 w przeglądarce odpowiada portowi 80 w kontenerze

```bash
docker run -d -p 3000:80 -p 8080:80 nginx:latest
```

mapping multiple ports

## Managing containers:

```bash
docker rm 8642e3b95c0b 
```

removing particular container

```bash
docker ps -aq
```

displaying only containers id

```bash
docker rm $(docker ps -aq)
docker rm -f $(docker ps -aq) // -f means force removal, it will remove also running container
```

removing all containers

```
docker run --name website -d -p 3000:80 -p 8080:80 nginx:latest
```

naming container

```bash
docker ps --format="ID\t{{.ID}}\nNAME\t{{.Names}}\nImage\t{{.Image}}\nPORTS\t{{.Ports}}\nCOMMAND\t{{.Command}}\nCREATED\t{{.CreatedAt}}\nSTATUS\t{{.Status}}\n"

```

creating a special display format

```
export FORMAT="ID\t{{.ID}}\nNAME\t{{.Names}}\nImage\t{{.Image}}\nPORTS\t{{.Ports}}\nCOMMAND\t{{.Command}}\nCREATED\t{{.CreatedAt}}\nSTATUS\t{{.Status}}\n"

```

```
 docker ps --format=$FORMAT

```

assigning special format to variable and usage

## Manage data in Docker

By default all files created inside a container are stored on a writable container layer. This means that:

- The data doesn’t persist when that container no longer exists, and it can be difficult to get the data out of the container if another process needs it.
- A container’s writable layer is tightly coupled to the host machine where the container is running. You can’t easily move the data somewhere else.
- Writing into a container’s writable layer requires a [storage driver](https://docs.docker.com/storage/storagedriver/) to manage the filesystem. The storage driver provides a union filesystem, using the Linux kernel. This extra abstraction reduces performance as compared to using *data volumes*, which write directly to the host filesystem.

Docker has two options for containers to store files in the host machine, so that the files are persisted even after the container stops: *volumes*, and *bind mounts*. If you’re running Docker on Linux you can also use a *tmpfs mount*. If you’re running Docker on Windows you can also use a *named pipe*.

![types of mounts and where they live on the Docker host](https://docs.docker.com/storage/images/types-of-mounts.png)

- **Volumes** are stored in a part of the host filesystem which is *managed by Docker* (`/var/lib/docker/volumes/` on Linux). Non-Docker processes should not modify this part of the filesystem. Volumes are the best way to persist data in Docker.
- **Bind mounts** may be stored *anywhere* on the host system. They may even be important system files or directories. Non-Docker processes on the Docker host or a Docker container can modify them at any time.
- **`tmpfs` mounts** are stored in the host system’s memory only, and are never written to the host system’s filesystem.



### Docker volumes

```bash
docker run --name website -v $(pwd):/usr/share/nginx/html:ro -d -p 3000:80 nginx
```

```bash
docker run --name website -v C:\Projects\my-projects\Other\DockerAndKubernetes\website:/usr/share/nginx/html:ro -d -p 3000:80 nginx
```

assigning nginx container path to (pwd) current path on terminal



### Sharing files between containers

```bash
docker run --name website-copy --volumes-from website -d -p 3001:80 nginx
```



# Using dockerfile

Docker can build images automatically by reading the instructions from a `Dockerfile`. A `Dockerfile` is a text document that contains all the commands a user could call on the command line to assemble an image. Using `docker build` users can create an automated build that executes several command-line instructions in succession.

```dockerfile
FROM nginx:latest
ADD . /usr/share/nginx/html
# Add eveything from the current directory to the image path
```

base dockerfile

```dockerfile
FROM node:latest
WORKDIR /app
# any command that follows above line will be execuded inside app folder inside the container
ADD . .
RUN npm install
# RUN has 2 forms:
#     RUN <command> (shell form, the command is run in a shell, which by default is /bin/sh -c on Linux or cmd /S /C on Windows)
#     RUN ["executable", "param1", "param2"] (exec form)

# The RUN instruction will execute any commands in a new layer on top of the current image and commit the results. The resulting committed image will be used for the next step in the Dockerfile.
CMD node index.js
# The CMD instruction has three forms:

#     CMD ["executable","param1","param2"] (exec form, this is the preferred form)
#     CMD ["param1","param2"] (as default parameters to ENTRYPOINT)
#     CMD command param1 param2 (shell form)

# There can only be one CMD instruction in a Dockerfile. If you list more than one CMD then only the last CMD will take effect.
```

another dockerfile

```bash
 docker build --tag website:latest .
```

command which build docker image base on docker file

```bash
docker run --name website -p 3000:80 -d website:latest
```

now we can run a docker container base on "website" image

# .dockeringore

![image-20210722154258620](C:\Users\gmalarski\AppData\Roaming\Typora\typora-user-images\image-20210722154258620.png)

# Docker caching



## About Layer Caching in Docker

https://docs.semaphoreci.com/ci-cd-environment/docker-layer-caching/

Docker creates container images using layers. Each command that is found in a `Dockerfile` creates a new layer. Each layers contains the filesystem changes of the image between the state before the execution of the command and the state after the execution of the command.

Docker uses a layer cache to optimize the process of building Docker images and make it faster.

Docker Layer Caching mainly works on `RUN`, `COPY` and `ADD` commands, which are going to be explained in more detail.

```dockerfile
FROM node:latest
WORKDIR /app
ADD package*.json ./
RUN npm install
ADD . .
CMD node index.js

```

Because each command is a separate layer, until docker meet changes everyting is created from cache when building. If we add someting to do file these changes will detected only in "ADD" step.

# Docker image alpine versions

## <none> image

![image-20210726123857699](C:\Users\gmalarski\AppData\Roaming\Typora\typora-user-images\image-20210726123857699.png)

none image appear because we run a query with new build but we are using the same name for an image. We cannot have two images with the same name.

# Tag image

We can tag particular image with the below command

```bash
docker tag grzesiek-website:latest grzesiek-website:1
```



# Building own image

```
docker build -t amigoscode-website:latest .
```



# Docker inspect

```
docker inspect f53f44118e9c
```

# Docker logs

```bash
docker inspect f53f44118e9c
docker inspect -f f53f44118e9c
```

-f -  means fallow



Docker execute

```bash
docker exec -it 8a9440cd1ccc /bin/sh
```



# Docker and MySql

```
docker run --name tn_db_mysql -e MYSQL_ROOT_PASSWORD=root -d mysql:latest
```



```dockerfile
docker exec -it tn_db_mysql bash
```

we are in container bash terminal

```bash
mysql -u root -p
```

log in to mysql



# Docker Compose 

https://docs.docker.com/compose/

Compose is a tool for defining and running multi-container Docker applications. With Compose, you use a YAML file to configure your application’s services. Then, with a single command, you create and start all the services from your configuration. To learn more about all the features of Compose, see [the list of features](https://docs.docker.com/compose/#features).

Compose works in all environments: production, staging, development, testing, as well as CI workflows. You can learn more about each case in [Common Use Cases](https://docs.docker.com/compose/#common-use-cases).

Using Compose is basically a three-step process:

1. Define your app’s environment with a `Dockerfile` so it can be reproduced anywhere.
2. Define the services that make up your app in `docker-compose.yml` so they can be run together in an isolated environment.
3. Run `docker compose up` and the [Docker compose command](https://docs.docker.com/compose/cli-command/) starts and runs your entire app. You can alternatively run `docker-compose up` using the docker-compose binary.

A `docker-compose.yml` looks like this:

```yaml
version: "3.9"  # optional since v1.27.0
services:
  web:
    build: .
    ports:
      - "5000:5000"
    volumes:
      - .:/code
      - logvolume01:/var/log
    links:
      - redis
  redis:
    image: redis
volumes:
  logvolume01: {}
```