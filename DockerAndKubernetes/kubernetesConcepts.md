# What is Kubernetes?

https://avinetworks.com/glossary/kubernetes-architecture/

This page is an overview of Kubernetes.

Kubernetes is a portable, extensible, open-source platform for  managing containerized workloads and services, that facilitates both  declarative configuration and automation. It has a large, rapidly  growing ecosystem. Kubernetes services, support, and tools are widely  available.

The name Kubernetes originates from Greek, meaning helmsman or pilot. K8s as an abbreviation results from counting the eight letters between  the "K" and the "s". Google open-sourced the Kubernetes project in 2014. Kubernetes combines [over 15 years of Google's experience](https://kubernetes.io/blog/2015/04/borg-predecessor-to-kubernetes/) running production workloads at scale with best-of-breed ideas and practices from the community.

**The need for a container orchestration tool**

- trend from Monolith to Microservices
- increased usage of containers

**What features do orchestration tools offers**

- High availability or no downtime
- Scalability or high performance
- Disaster recovery - backup and restore

![image-20210726162045041](C:\Projects\my-projects\Other\DockerAndKubernetes\images\image-20210726162045041.png)

## Kubernetes architecture

![Image depicts a Kubernetes Architecture diagram with the different components like control plane, nodes, pods and more.](C:\Projects\my-projects\Other\DockerAndKubernetes\images\kubernetes-architecture-diagram.png)

A Kubernetes cluster is a form of Kubernetes deployment architecture.  Basic Kubernetes architecture exists in two parts: the control plane and the nodes or compute machines. Each node could be either a physical or  virtual machine and is its own Linux environment. Every node also runs  pods, which are composed of containers.

## Kubernetes Control Plane

- Houses Kubernetes cluster architecture components that control the cluster
- Maintains a data records of the configuration and all of the clusters Kubernetes objects

Several major components comprise the control plane: the API server, the scheduler, the controller-manager, and etcd. These core Kubernetes  components ensure containers are running with the necessary resources in sufficient numbers. These components can all run on one master node,  but many enterprises concerned about fault tolerance replicate them  across multiple nodes to achieve high availability.

### **Kubernetes API Server**

The front end of the Kubernetes control plane, the API Server supports  updates, scaling, and other kinds of lifecycle orchestration by  providing APIs for various types of applications. Clients must be able  to access the API server from outside the cluster, because it serves as  the gateway, supporting lifecycle orchestration at each stage. In that  role, clients use the API server as a tunnel to pods, services, and  nodes, and authenticate via the API server.

### **Kubernetes Scheduler**

The Kubernetes scheduler stores the resource usage data for each compute node; determines whether a cluster is healthy; and determines whether  new containers should be deployed, and if so, where they should be  placed. The scheduler considers the health of the cluster generally  alongside the pod’s resource demands, such as CPU or memory. Then it  selects an appropriate compute node and schedules the task, pod, or  service, taking resource limitations or guarantees, data locality, the  quality of the service requirements, anti-affinity and affinity  specifications, and other factors into account.

### **Kubernetes Controller Manager**

The controller watches the objects it manages in the cluster as it runs  the Kubernetes core control loops. It observes them for their desired  state and current state via the API server. If the current and desired  states of the managed objects don’t match, the controller takes  corrective steps to drive object status toward the desired state. The  Kubernetes controller also performs core lifecycle functions.

### **ETCD**

Distributed and fault-tolerant, etcd is an open source, key-value  store database that stores configuration data and information about the  state of the cluster. etcd may be configured externally, although it is  often part of the Kubernetes control plane.

etcd stores the cluster state based on the Raft consensus algorithm.  This helps cope with a common problem that arises in the context of  replicated state machines and involves multiple servers agreeing on  values. Raft defines three different roles: leader, candidate, and  follower, and achieves consensus by electing a leader.

In this way, etcd acts as the single source of truth (SSOT) for all  Kubernetes cluster components, responding to queries from the control  plane and retrieving various parameters of the state of the containers,  nodes, and pods. etcd is also used to store configuration details such  as ConfigMaps, subnets, and Secrets, along with cluster state data.



## Cluster nodes 

Managed by the control plane, cluster nodes are machines that run  containers. Each node runs an agent for communicating with the master,  the kubelet—the primary Kubernetes controller. Each node also runs a  container runtime engine, such as Docker or rkt. The node also runs  additional components for monitoring, logging, service discovery, and  optional extras.

### **Nodes**

A Kubernetes cluster must have at least one compute node, although it may have many, depending on the need for capacity. Pods orchestrated  and scheduled to run on nodes, so more nodes are needed to scale up  cluster capacity.

Nodes do the work for a Kubernetes cluster. They connect applications and networking, compute, and storage resources.

Nodes may be cloud-native virtual machines (VMs) or bare metal servers in data centers.

### **Container Runtime Engine**

Each compute node runs and manages container life cycles using a  container runtime engine. Kubernetes supports Open Container  Initiative-compliant runtimes such as Docker, CRI-O, and rkt.

### **Kubelet service**

Each compute node includes a kubelet, an agent that communicates with the master or control plane to ensure the containers in a pod are  running. When the control plane requires a specific action happen in a  node, the kubelet receives the pod specifications through the API server and executes the action. It then ensures the associated containers are  healthy and running.

### **Kube-proxy service**

Each compute node contains a network proxy called a kube-proxy that  facilitates Kubernetes networking services. The kube-proxy either  forwards traffic itself or relies on the packet filtering layer of the  operating system to handle network communications both outside and  inside the cluster.

The kube-proxy runs on each node to ensure that services are  available to external parties and deal with individual host subnetting.  It serves as a network proxy and service [load balancer](https://avinetworks.com/glossary/load-balancer/) on its node, managing the network routing for UDP and TCP packets. In  fact, the kube-proxy routes traffic for all service endpoints.

### **Pods**

![image-20210728082401396](C:\Projects\my-projects\Other\DockerAndKubernetes\images\image-20210728082401396.png)

![image-20210728083256823](C:\Projects\my-projects\Other\DockerAndKubernetes\images\image-20210728083256823.png)

![image-20210728084256420](C:\Projects\my-projects\Other\DockerAndKubernetes\images\image-20210728084256420.png)

A pod represents a single instance of an application, and the  simplest unit within the Kubernetes object model. However, pods are  central and crucial to Kubernetes. Each pod is composed of a container  or tightly coupled containers in a series that logically go together,  along with rules that control how the containers run.

Pods have a limited lifespan and eventually die after upgrading or  scaling back down. However, although they are ephemeral (efemeryczny - krotkotrwaly) pods can run  stateful applications by connecting to persistent storage.

Pods are also capable of horizontal autoscaling, meaning they can  grow or shrink(kurczyc sie, zmniejszac sie) the number of instances running. They can also perform  rolling updates and canary deployments.

Pods run together on nodes, so they share content and storage and can reach other pods via localhost. Containers may span multiple machines,  so pods may as well. **One node can run multiple pods, each collecting  multiple containers.**

The pod is the core unit of management in the Kubernetes ecosystem  and acts as the logical boundary for containers that share resources and context. Differences in virtualization and containerization are  mitigated by the pod grouping mechanism, which enables running multiple  dependent processes together.

Services associate specific criteria with pods to enable their  discovery. Pods and services are associated through key-value pairs  called selectors and labels. Any new match between a pod label and  selector will be discovered automatically by the service.

### Service

An abstract way to expose an application running on a set of [Pods](https://kubernetes.io/docs/concepts/workloads/pods/) as a network service.

With Kubernetes you don't need to modify your application to use an unfamiliar service discovery mechanism. Kubernetes gives Pods their own IP addresses and a single DNS name for a set of Pods, and can load-balance across them.

# Deployment

![image-20210728085211240](C:\Projects\my-projects\Other\DockerAndKubernetes\images\image-20210728085211240.png)





# minikube

Minikube is a utility you can use to run [Kubernetes (k8s)](https://sensu.io/resources/whitepaper/whitepaper-monitoring-kubernetes-the-sidecar-pattern) on your local machine. It creates a single node cluster contained in a virtual machine (VM). This cluster lets you demo Kubernetes operations without requiring the time and resource-consuming installation of full-blown K8s.

![image-20210728085625668](C:\Projects\my-projects\Other\DockerAndKubernetes\images\image-20210728085625668.png)

![image-20210728085703452](C:\Projects\my-projects\Other\DockerAndKubernetes\images\image-20210728085703452.png)



# kubectl

From a user’s point of view, kubectl is your cockpit to control Kubernetes. It allows you to perform every possible Kubernetes operation.

From a technical point of view, kubectl is a client for the Kubernetes API.

The Kubernetes API is an HTTP REST API. This API is the real Kubernetes user interface. Kubernetes is fully controlled through this API. This means that every Kubernetes operation is exposed as an API endpoint and can be executed by an HTTP request to this endpoint.

![img](C:\Projects\my-projects\Other\DockerAndKubernetes\images\pic.svg)

![image-20210728090102974](C:\Projects\my-projects\Other\DockerAndKubernetes\images\image-20210728090102974.png)