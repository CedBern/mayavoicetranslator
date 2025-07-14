// Middleware FPIC (Free, Prior and Informed Consent) pour Node.js/TypeScript
import { Request, Response, NextFunction } from 'express';

export interface FPICConfig {
  communityId: string;
  resourceType: 'traditional_knowledge' | 'cultural_artifact' | 'data';
  requiredConsent: 'community_elder' | 'council' | 'individual';
}

export const fpicMiddleware = (config: FPICConfig) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { communityId, resourceType } = config;
    // TODO: Intégrer la logique de validation communautaire réelle
    const consent = await validateCommunityConsent(communityId, resourceType);
    if (!consent.isValid) {
      return res.status(403).json({
        error: 'FPIC_CONSENT_REQUIRED',
        message: 'Free, Prior and Informed Consent required',
        contactInfo: consent.communityContact
      });
    }
    await logCulturalAccess(req.user, communityId, resourceType);
    next();
  };
};

// Placeholders à implémenter selon la logique projet
async function validateCommunityConsent(communityId: string, resourceType: string) {
  return { isValid: true, communityContact: 'contact@example.com' };
}
async function logCulturalAccess(user: any, communityId: string, resourceType: string) {
  // Logique d'audit
}
