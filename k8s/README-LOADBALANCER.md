# Load Balancer Configuration

## SSL Certificate Setup

Before deploying the load balancer, you need to create an SSL certificate in DigitalOcean:

### Option 1: Using DigitalOcean CLI

```bash
# Create Let's Encrypt certificate
doctl compute certificate create \
  --name your-ssl-cert-name \
  --dns-names yourdomain.com,www.yourdomain.com \
  --type lets_encrypt

# Get the certificate ID
doctl compute certificate list
```

### Option 2: Using DigitalOcean Web UI

1. Go to DigitalOcean Control Panel → Networking → Certificates
2. Click "Create Certificate"
3. Choose "Let's Encrypt"
4. Add domains: `yourdomain.com`, `www.yourdomain.com`
5. Name: `your-ssl-cert-name`

## Deployment

### Using Certificate ID (Recommended)

```bash
# Set environment variable
export SSL_CERTIFICATE_ID="your-certificate-id-here"

# Deploy with envsubst
envsubst < k8s/loadbalancer-template.yaml | kubectl apply -f -
```

### Using Certificate Name

```bash
# Set environment variable
export SSL_CERTIFICATE_NAME="your-ssl-cert-name"

# Deploy with envsubst
envsubst < k8s/loadbalancer-template.yaml | kubectl apply -f -
```

## DNS Configuration

After deployment, update your DNS A records to point to the load balancer IP:

```bash
# Get the load balancer IP
kubectl get service workpace-loadbalancer -n workpace -o wide
```

Update DNS:

- `yourdomain.com` → Load Balancer IP
- `www.yourdomain.com` → Load Balancer IP

## Security Notes

- Never commit actual certificate IDs or names to version control
- Use environment variables or CI/CD secrets
- The template file is safe to commit to GitHub
