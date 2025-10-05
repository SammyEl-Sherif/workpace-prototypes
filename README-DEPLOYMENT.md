# WorkPace Kubernetes Deployment Guide

This guide covers the complete process of deploying the WorkPace application to a Kubernetes cluster on Digital Ocean.

## Prerequisites

- Digital Ocean Kubernetes cluster (ID: `57583eec-5184-4dd7-a81b-3473626649e3`)
- Digital Ocean Container Registry access
- kubectl configured to access the cluster
- Docker installed locally (for testing)
- GitHub repository with proper secrets configured

## Required Secrets

Before deploying, ensure the following secrets are configured in your GitHub repository:

### GitHub Secrets

- `DIGITALOCEAN_ACCESS_TOKEN`: Digital Ocean API token
- `KUBE_CONFIG`: Base64 encoded kubeconfig file for the cluster

### Kubernetes Secrets

Create a `k8s/secret.yaml` file (based on `k8s/secret-template.yaml`) with:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: workpace-secrets
  namespace: workpace
type: Opaque
data:
  database-url: <BASE64_ENCODED_DATABASE_URL>
  nextauth-secret: <BASE64_ENCODED_NEXTAUTH_SECRET>
```

To encode values:

```bash
echo -n "your-secret-value" | base64
```

## Deployment Steps

### 1. Containerization

The application is containerized using a multi-stage Docker build:

```dockerfile
# Optimized Dockerfile with multi-stage build
FROM node:18-alpine AS base
# ... (see Dockerfile for complete configuration)
```

Key features:

- Multi-stage build for smaller production image
- Non-root user for security
- Standalone Next.js output
- Health checks included

### 2. Kubernetes Configuration

The deployment includes the following Kubernetes resources:

#### Namespace

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: workpace
```

#### Deployment

- 2 replicas for high availability
- Resource limits and requests
- Health checks (liveness and readiness probes)
- Environment variables from secrets

#### Service

- ClusterIP service exposing port 80
- Routes traffic to application pods

#### Ingress

- NGINX ingress controller
- SSL/TLS termination with Let's Encrypt
- Support for both `workpace.io` and `www.workpace.io`

### 3. SSL/TLS Configuration

Automatic SSL certificate management using cert-manager:

```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@workpace.io
    # ... (see k8s/cert-manager-issuer.yaml)
```

### 4. CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/deploy-k8s.yml`) provides:

- Automatic builds on push to main branch
- Docker image building and pushing to Digital Ocean Container Registry
- Kubernetes deployment updates
- Deployment verification

### 5. Deployment Script

Use the provided deployment script for manual operations:

```bash
# Deploy the application
./scripts/deploy.sh deploy

# Check deployment status
./scripts/deploy.sh status

# View logs
./scripts/deploy.sh logs

# Scale deployment
./scripts/deploy.sh scale 3
```

## Manual Deployment

If you prefer to deploy manually:

1. **Create namespace:**

   ```bash
   kubectl apply -f k8s/namespace.yaml
   ```

2. **Create secrets:**

   ```bash
   kubectl apply -f k8s/secret.yaml
   ```

3. **Deploy application:**

   ```bash
   kubectl apply -f k8s/deployment.yaml
   kubectl apply -f k8s/service.yaml
   kubectl apply -f k8s/ingress.yaml
   ```

4. **Verify deployment:**
   ```bash
   kubectl get pods -n workpace
   kubectl get svc -n workpace
   kubectl get ingress -n workpace
   ```

## DNS Configuration

Update your DNS records to point to the Kubernetes cluster:

- **A Record:** `workpace.io` → `[LOAD_BALANCER_IP]`
- **A Record:** `www.workpace.io` → `[LOAD_BALANCER_IP]`
- **CNAME Record:** `*.workpace.io` → `workpace.io`

To get the load balancer IP:

```bash
kubectl get ingress workpace-ingress -n workpace
```

## Monitoring and Logging

The deployment includes monitoring capabilities:

- **Prometheus:** Metrics collection
- **Grafana:** Visualization dashboards
- **Loki:** Log aggregation

Access monitoring tools through their respective services in the cluster.

## Troubleshooting

### Common Issues

1. **Pod not starting:**

   ```bash
   kubectl describe pod <pod-name> -n workpace
   kubectl logs <pod-name> -n workpace
   ```

2. **Service not accessible:**

   ```bash
   kubectl get svc -n workpace
   kubectl get endpoints -n workpace
   ```

3. **Ingress not working:**

   ```bash
   kubectl describe ingress workpace-ingress -n workpace
   kubectl get ingress -n workpace
   ```

4. **SSL certificate issues:**
   ```bash
   kubectl get certificates -n workpace
   kubectl describe certificate workpace-tls -n workpace
   ```

### Health Checks

The application includes health checks:

- **Liveness probe:** Checks if the application is running
- **Readiness probe:** Checks if the application is ready to serve traffic

### Scaling

Scale the deployment as needed:

```bash
kubectl scale deployment workpace-app -n workpace --replicas=3
```

## Security Considerations

- Application runs as non-root user
- Secrets are stored in Kubernetes secrets (not in code)
- SSL/TLS encryption for all traffic
- Resource limits prevent resource exhaustion
- Network policies can be added for additional security

## Performance Optimization

- Multi-stage Docker build reduces image size
- Resource requests and limits ensure proper scheduling
- Health checks enable proper load balancing
- Horizontal Pod Autoscaler can be added for automatic scaling

## Backup and Recovery

- Database backups should be configured separately
- Kubernetes cluster backups are handled by Digital Ocean
- Application state is stateless (stored in database)

## Cost Optimization

- Resource limits prevent over-provisioning
- Horizontal Pod Autoscaler can scale down during low usage
- Consider using spot instances for non-critical workloads

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Review Kubernetes logs and events
3. Contact the engineering team

## Acceptance Criteria

- [ ] Application successfully deployed to Kubernetes cluster
- [ ] CI/CD pipeline working - new code on main branch automatically deployed
- [ ] SSL/TLS working correctly (https://workpace.io accessible)
- [ ] Application is responsive and performs at least as well as on the droplet
- [ ] Monitoring and alerting set up for the application

## Testing Checklist

- [ ] Verify application is accessible at workpace.io
- [ ] Test scaling by increasing replicas and verifying load balancing
- [ ] Monitor resource utilization during peak usage
- [ ] Ensure zero-downtime deployments by testing updates
- [ ] Test failover by simulating node failures
