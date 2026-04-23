## Kubernetes Interview Questions & Answers

---

## 🔵 Beginner Level

---

### 1. What is Kubernetes and why do we use it?

Kubernetes (K8s) is an open-source **container orchestration platform** that automates deployment, scaling, and management of containerized applications.

**Why use it?**

```
Without K8s:                    With K8s:
┌─────────────────────┐         ┌─────────────────────────────────┐
│ Manual deployments  │         │ Auto deployment & rollback      │
│ No auto-scaling     │         │ Auto scaling (HPA/VPA)          │
│ Manual recovery     │         │ Self-healing (restarts pods)    │
│ Downtime on update  │         │ Zero-downtime rolling updates   │
│ Hard to scale       │         │ Scale with single command       │
└─────────────────────┘         └─────────────────────────────────┘
```

---

### 2. What are the core components of Kubernetes Architecture?

```
┌─────────────────────────────────────────────────────────────┐
│                        CONTROL PLANE                        │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌────────────────────┐  │
│  │ API Server  │  │  Scheduler  │  │Controller Manager  │  │
│  │ (kube-      │  │ (kube-      │  │(kube-controller-   │  │
│  │ apiserver)  │  │ scheduler)  │  │    manager)        │  │
│  └─────────────┘  └─────────────┘  └────────────────────┘  │
│           │                                                  │
│  ┌────────▼────────────────────────────────────────────┐    │
│  │                    etcd (key-value store)           │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                          │
         ┌────────────────┼────────────────┐
         ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   WORKER 1   │  │   WORKER 2   │  │   WORKER 3   │
│              │  │              │  │              │
│  kubelet     │  │  kubelet     │  │  kubelet     │
│  kube-proxy  │  │  kube-proxy  │  │  kube-proxy  │
│  Container   │  │  Container   │  │  Container   │
│  Runtime     │  │  Runtime     │  │  Runtime     │
│  [Pod][Pod]  │  │  [Pod][Pod]  │  │  [Pod]       │
└──────────────┘  └──────────────┘  └──────────────┘
```

| Component              | Role                                                    |
| ---------------------- | ------------------------------------------------------- |
| **API Server**         | Front door — all communication goes through it          |
| **Scheduler**          | Decides which node a Pod runs on                        |
| **Controller Manager** | Maintains desired state (restarts crashed pods)         |
| **etcd**               | Distributed key-value store — cluster's source of truth |
| **kubelet**            | Agent on each node, ensures pods are running            |
| **kube-proxy**         | Handles networking and load balancing on nodes          |

---

### 3. What is a Pod?

The **smallest deployable unit** in Kubernetes. A Pod wraps one or more containers that share network and storage.

```yaml
# pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-app-pod
  labels:
    app: my-app
spec:
  containers:
    - name: my-app
      image: nginx:latest
      ports:
        - containerPort: 80
      resources:
        requests:
          memory: "64Mi"
          cpu: "250m"
        limits:
          memory: "128Mi"
          cpu: "500m"
```

```bash
kubectl apply -f pod.yaml
kubectl get pods
kubectl describe pod my-app-pod
kubectl logs my-app-pod
kubectl exec -it my-app-pod -- /bin/bash
```

> ⚠️ Pods are **ephemeral** — if a Pod dies, it's gone. Use Deployments to manage them.

---

### 4. Pod vs Deployment vs ReplicaSet?

```
Deployment (manages strategy & rollout)
    └── ReplicaSet (maintains desired number of pods)
            └── Pod  └── Pod  └── Pod
```

| Object         | Purpose                                           |
| -------------- | ------------------------------------------------- |
| **Pod**        | Single instance of a running container            |
| **ReplicaSet** | Ensures N copies of a Pod are always running      |
| **Deployment** | Manages ReplicaSets; handles rollouts & rollbacks |

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3 # ReplicaSet → 3 pods always
  selector:
    matchLabels:
      app: my-app
  strategy:
    type: RollingUpdate # zero-downtime updates
    rollingUpdate:
      maxSurge: 1 # 1 extra pod during update
      maxUnavailable: 0 # no pods down during update
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
        - name: my-app
          image: my-app:v1
          ports:
            - containerPort: 3000
```

```bash
kubectl apply -f deployment.yaml
kubectl get deployments
kubectl rollout status deployment/my-app

# Rollback
kubectl rollout undo deployment/my-app
kubectl rollout undo deployment/my-app --to-revision=2
```

---

### 5. What is a Service? Types?

A **Service** gives Pods a stable IP/DNS even when Pods restart. It load-balances traffic across matching Pods.

```
Without Service:  Client → Pod IP (changes on restart!) ❌
With Service:     Client → Service (stable) → Pod1/Pod2/Pod3 ✅
```

```yaml
# ClusterIP (default — internal only)
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  type: ClusterIP
  selector:
    app: my-app # routes to pods with this label
  ports:
    - port: 80
      targetPort: 3000
```

| Type             | Access                         | Use Case                        |
| ---------------- | ------------------------------ | ------------------------------- |
| **ClusterIP**    | Internal only                  | Microservice-to-microservice    |
| **NodePort**     | `NodeIP:NodePort` from outside | Dev/testing                     |
| **LoadBalancer** | Cloud load balancer (AWS/GCP)  | Production external traffic     |
| **ExternalName** | Maps to external DNS           | Connecting to external services |

```bash
kubectl get services
kubectl expose deployment my-app --type=LoadBalancer --port=80
kubectl describe service my-service
```

---

## 🟡 Intermediate Level

---

### 6. What is a ConfigMap and Secret?

**ConfigMap** → stores non-sensitive config (env vars, config files)
**Secret** → stores sensitive data (passwords, tokens) base64 encoded

```yaml
# ConfigMap
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  APP_ENV: "production"
  APP_PORT: "3000"
  config.json: |
    {
      "timeout": 30,
      "retries": 3
    }
---
# Secret
apiVersion: v1
kind: Secret
metadata:
  name: app-secret
type: Opaque
data:
  DB_PASSWORD: cGFzc3dvcmQxMjM= # base64 encoded "password123"
  API_KEY: c2VjcmV0a2V5 # base64 encoded "secretkey"
```

```yaml
# Use in Pod
spec:
  containers:
    - name: my-app
      image: my-app:v1
      envFrom:
        - configMapRef:
            name: app-config # all ConfigMap keys as env vars
        - secretRef:
            name: app-secret # all Secret keys as env vars
      volumeMounts:
        - name: config-volume
          mountPath: /etc/config # mount config.json as file
  volumes:
    - name: config-volume
      configMap:
        name: app-config
```

```bash
kubectl create configmap app-config --from-literal=APP_ENV=production
kubectl create secret generic app-secret --from-literal=DB_PASSWORD=pass123

echo -n 'password123' | base64         # encode
echo 'cGFzc3dvcmQxMjM=' | base64 -d   # decode

kubectl get configmaps
kubectl get secrets
kubectl describe secret app-secret
```

---

### 7. What is a Namespace?

Virtual cluster within a cluster — used to **isolate resources** by team, environment, or project.

```
Cluster
├── namespace: default        (default playground)
├── namespace: kube-system    (K8s internal components)
├── namespace: production     (prod workloads)
├── namespace: staging        (staging workloads)
└── namespace: dev            (dev workloads)
```

```bash
kubectl create namespace production
kubectl get pods -n production
kubectl apply -f deployment.yaml -n production

# Set default namespace for current context
kubectl config set-context --current --namespace=production

# Get resources across all namespaces
kubectl get pods --all-namespaces
```

---

### 8. What is Ingress?

Ingress manages **external HTTP/HTTPS routing** to internal services — like a smart reverse proxy / API gateway.

```
Internet
   │
   ▼
[ Ingress Controller ]  (nginx, traefik, etc.)
   │
   ├──/api/*    ──► api-service:80
   ├──/auth/*   ──► auth-service:80
   └──/web/*    ──► frontend-service:3000
```

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
    - host: myapp.com
      http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: api-service
                port:
                  number: 80
          - path: /auth
            pathType: Prefix
            backend:
              service:
                name: auth-service
                port:
                  number: 80
  tls:
    - hosts:
        - myapp.com
      secretName: tls-secret # SSL cert stored as Secret
```

```bash
kubectl apply -f ingress.yaml
kubectl get ingress
kubectl describe ingress my-ingress
```

---

### 9. HPA — Horizontal Pod Autoscaler

Automatically **scales pod count** based on CPU/memory or custom metrics.

```
Low Traffic:   [Pod1]
                          HPA watches metrics...
High Traffic:  [Pod1] [Pod2] [Pod3] [Pod4] [Pod5]
```

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: my-app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-app
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70 # scale up if CPU > 70%
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
```

```bash
kubectl apply -f hpa.yaml
kubectl get hpa
kubectl describe hpa my-app-hpa

# Quick HPA creation
kubectl autoscale deployment my-app --min=2 --max=10 --cpu-percent=70
```

---

### 10. What are Liveness, Readiness & Startup Probes?

```
Startup Probe   → "Is the app done starting up?"
Liveness Probe  → "Is the app alive? (restart if not)"
Readiness Probe → "Is the app ready to serve traffic?"
```

```yaml
spec:
  containers:
    - name: my-app
      image: my-app:v1

      # Startup: wait for slow-starting apps (checks every 10s, up to 30 tries)
      startupProbe:
        httpGet:
          path: /health
          port: 3000
        failureThreshold: 30
        periodSeconds: 10

      # Liveness: restarts pod if app is deadlocked/crashed
      livenessProbe:
        httpGet:
          path: /health
          port: 3000
        initialDelaySeconds: 15
        periodSeconds: 20
        failureThreshold: 3

      # Readiness: removes pod from Service if not ready
      readinessProbe:
        httpGet:
          path: /ready
          port: 3000
        initialDelaySeconds: 5
        periodSeconds: 10
        successThreshold: 1
        failureThreshold: 3
```

| Probe         | Failure Action                            |
| ------------- | ----------------------------------------- |
| **Startup**   | Container kept waiting (not killed yet)   |
| **Liveness**  | Container **restarted**                   |
| **Readiness** | Pod **removed from Service** (no traffic) |

---

## 🔴 Advanced Level

---

### 11. What is etcd and why is it critical?

`etcd` is a **distributed key-value store** that holds the entire cluster state.

```
Every object in K8s is stored in etcd:
/registry/pods/default/my-pod
/registry/services/default/my-service
/registry/deployments/default/my-app
```

> ⚠️ If etcd goes down → entire cluster is blind. Always backup etcd in production!

```bash
# Backup etcd
ETCDCTL_API=3 etcdctl snapshot save snapshot.db \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=/etc/etcd/ca.crt \
  --cert=/etc/etcd/etcd.crt \
  --key=/etc/etcd/etcd.key

# Restore
ETCDCTL_API=3 etcdctl snapshot restore snapshot.db
```

---

### 12. Rolling Update vs Blue-Green vs Canary

```
Rolling Update:
v1 v1 v1 v1   →   v2 v1 v1 v1  →  v2 v2 v1 v1  →  v2 v2 v2 v2
(gradual replacement, zero downtime)

Blue-Green:
BLUE (v1) ◄── traffic          BLUE (v1) idle
GREEN (v2) idle     →          GREEN (v2) ◄── traffic (instant switch)

Canary:
v1 v1 v1 v1 v1     →    v1 v1 v1 v1 [v2]   →  gradually shift traffic
(test v2 with 5% traffic first)
```

```yaml
# Canary with Ingress (5% to canary)
annotations:
  nginx.ingress.kubernetes.io/canary: "true"
  nginx.ingress.kubernetes.io/canary-weight: "5" # 5% traffic to canary
```

---

### 13. Resource Requests vs Limits

```yaml
resources:
  requests: # guaranteed minimum (used for scheduling)
    memory: "128Mi"
    cpu: "250m" # 250 millicores = 0.25 CPU
  limits: # hard cap (OOMKilled if memory exceeded)
    memory: "256Mi"
    cpu: "500m"
```

```
Node has 4 CPU, 8GB RAM
Pod A requests: 1 CPU, 2GB  ✅ scheduled
Pod B requests: 2 CPU, 4GB  ✅ scheduled
Pod C requests: 2 CPU, 4GB  ❌ insufficient — pending
```

> - CPU limit exceeded → **throttled** (not killed)
> - Memory limit exceeded → **OOMKilled** (killed & restarted)

---

### 14. StatefulSet vs Deployment

| Feature       | Deployment     | StatefulSet                 |
| ------------- | -------------- | --------------------------- |
| Pod identity  | Random names   | Stable: `pod-0`, `pod-1`    |
| Storage       | Shared or none | Dedicated PVC per pod       |
| Scaling order | Any order      | Sequential (0→1→2)          |
| Use case      | Stateless apps | Databases, Kafka, Zookeeper |

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mysql
spec:
  serviceName: mysql
  replicas: 3
  selector:
    matchLabels:
      app: mysql
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
        - name: mysql
          image: mysql:8
          volumeMounts:
            - name: data
              mountPath: /var/lib/mysql
  volumeClaimTemplates: # each pod gets its OWN PVC
    - metadata:
        name: data
      spec:
        accessModes: ["ReadWriteOnce"]
        resources:
          requests:
            storage: 10Gi
```

---

### 15. RBAC — Role Based Access Control

```
User/ServiceAccount → RoleBinding → Role → Resources
```

```yaml
# Role: what actions are allowed
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-reader
  namespace: default
rules:
  - apiGroups: [""]
    resources: ["pods", "pods/logs"]
    verbs: ["get", "list", "watch"] # read-only

---
# RoleBinding: who gets this role
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods-binding
  namespace: default
subjects:
  - kind: User
    name: dev-user
    apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io
```

```bash
kubectl auth can-i get pods --as=dev-user          # yes/no
kubectl auth can-i delete pods --as=dev-user       # no
kubectl get rolebindings
```

---

## Quick Cheatsheet

```
┌──────────────────────────────────────────────────────┐
│              KUBECTL COMMON COMMANDS                 │
├──────────────────────────────────────────────────────┤
│ kubectl get pods / nodes / services / deployments   │
│ kubectl describe pod <name>                         │
│ kubectl logs <pod> -f  (follow logs)                │
│ kubectl exec -it <pod> -- /bin/bash                 │
│ kubectl apply -f file.yaml                          │
│ kubectl delete -f file.yaml                         │
│ kubectl scale deployment my-app --replicas=5        │
│ kubectl set image deployment/my-app app=image:v2    │
│ kubectl rollout undo deployment/my-app              │
│ kubectl top pods / nodes  (resource usage)          │
│ kubectl port-forward pod/my-pod 8080:3000           │
│ kubectl cp pod:/path/file ./local-file              │
└──────────────────────────────────────────────────────┘
```
