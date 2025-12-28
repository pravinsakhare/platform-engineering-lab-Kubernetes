# Platform Engineering Lab - Runbook 📖

Quick operational guide for local Kubernetes development.

---

## Prerequisites

```bash
# Verify installations
docker --version
kind --version
kubectl version --client
```

Required: Docker Desktop, kind, kubectl

---

## Setup

### Create Cluster

```bash
kind create cluster --name platform-lab
```

### Install Metrics Server

```bash
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

kubectl patch deployment metrics-server -n kube-system --type='json' \
  -p='[{"op": "add", "path": "/spec/template/spec/containers/0/args/-", "value": "--kubelet-insecure-tls"}]'
```

---

## Build and Deploy

```bash
# Build image
docker build -t node-app:1.1 ./app

# Load into kind
kind load docker-image node-app:1.1 --name platform-lab

# Deploy
kubectl apply -f k8s/

# Verify
kubectl get all -n platform-dev
```

---

## Access Application

```bash
kubectl port-forward svc/node-app 8080:80 -n platform-dev
```

Open: http://localhost:8080

---

## Monitoring

```bash
# View pods
kubectl get pods -n platform-dev

# View logs
kubectl logs -l app=node-app -n platform-dev -f

# Check metrics
kubectl top pods -n platform-dev

# Check HPA
kubectl get hpa -n platform-dev
```

---

## Debugging

```bash
# Pod details
kubectl describe pod <pod-name> -n platform-dev

# Events
kubectl get events -n platform-dev --sort-by='.lastTimestamp'

# Exec into pod
kubectl exec -it <pod-name> -n platform-dev -- /bin/sh
```

---

## Autoscaling Demo

```bash
# Generate load
kubectl run load-generator \
  --image=busybox \
  --restart=Never \
  -n platform-dev \
  -- /bin/sh -c "while true; do wget -q -O- http://node-app.platform-dev.svc.cluster.local/load; done"

# Watch scaling (in separate terminals)
kubectl get hpa -n platform-dev -w
kubectl get pods -n platform-dev -w

# Cleanup
kubectl delete pod load-generator -n platform-dev
```

---

## Common Issues

**HPA shows "unknown"**
```bash
# Wait 30-60 seconds for metrics-server
kubectl get deployment metrics-server -n kube-system
```

**Pod not starting**
```bash
kubectl describe pod <pod-name> -n platform-dev
kubectl logs <pod-name> -n platform-dev
```

**Image not found**
```bash
# Reload image
kind load docker-image node-app:1.1 --name platform-lab
```

---

## Cleanup

```bash
# Delete application
kubectl delete -f k8s/

# Delete cluster
kind delete cluster --name platform-lab
```

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `kubectl get pods -n platform-dev` | List pods |
| `kubectl logs -f <pod> -n platform-dev` | Stream logs |
| `kubectl top pods -n platform-dev` | Resource usage |
| `kubectl scale deployment node-app --replicas=3 -n platform-dev` | Manual scale |
| `kubectl delete pod <pod> -n platform-dev` | Force restart |
