# Deployment

## Environments
- **Development**: Local Docker Compose
- **Staging**: Kubernetes / Docker Swarm (Testing)
- **Production**: Full HA setup with PostGIS, Redis, Kafka

## Commands
`make up` - Start local development
`make build` - Build images
`make logs` - View logs
