# Déploiement Kubernetes MayaVoiceTranslator (OVH/AWS)

## Prérequis
- Un cluster Kubernetes (OVH Managed K8s, AWS EKS, etc.)
- Un registre Docker privé (OVH Container Registry, AWS ECR, etc.)
- Secrets GitHub configurés :
  - `REGISTRY_URL`, `REGISTRY_USER`, `REGISTRY_PASSWORD`
  - `KUBECONFIG` (base64 du kubeconfig du cluster)

## Structure
- `k8s/maya-api-deployment.yaml` : Déploiement et service API
- `k8s/maya-frontend-deployment.yaml` : Déploiement et service Frontend
- `.github/workflows/deploy-k8s.yml` : Pipeline CI/CD complet

## Utilisation
1. Adaptez les images Docker dans les manifests Kubernetes (`<votre-registry>/maya-api:latest`, etc.)
2. Ajoutez vos secrets dans les paramètres du repo GitHub
3. Poussez sur `main` : le pipeline build, push et déploie automatiquement
4. Vérifiez le déploiement :
   ```bash
   kubectl get pods
   kubectl get svc
   ```

## Personnalisation
- Ajoutez vos variables d’environnement et secrets dans les manifests ou via `kubectl create secret`.
- Modifiez le nombre de replicas selon la charge attendue.
- Ajoutez un Ingress pour exposer le frontend/API publiquement.

## Support
Consultez la documentation du projet ou contactez l’équipe technique.
