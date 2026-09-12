import { Router, Response } from 'express';
import { z } from 'zod';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { User } from '../models/User';

const router = Router();

const profileUpdateSchema = z.object({
  heightCm: z.number().min(100).max(250).optional().nullable(),
  weightKg: z.number().min(30).max(200).optional().nullable(),
  chestCm: z.number().min(50).max(180).optional().nullable(),
  waistCm: z.number().min(40).max(160).optional().nullable(),
  shoulderCm: z.number().min(20).max(90).optional().nullable(),
  preferredFit: z.enum(['tight', 'regular', 'relaxed', 'oversized']).optional(),
  usualSizes: z.record(z.string()).optional(),
  preferredBrands: z.array(z.string()).optional()
});

router.put('/profile', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthenticated' });
      return;
    }

    const validated = profileUpdateSchema.parse(req.body);

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const updatedProfile = {
      ...user.profile,
      ...(validated.heightCm !== undefined && { heightCm: validated.heightCm || undefined }),
      ...(validated.weightKg !== undefined && { weightKg: validated.weightKg || undefined }),
      ...(validated.chestCm !== undefined && { chestCm: validated.chestCm || undefined }),
      ...(validated.waistCm !== undefined && { waistCm: validated.waistCm || undefined }),
      ...(validated.shoulderCm !== undefined && { shoulderCm: validated.shoulderCm || undefined }),
      ...(validated.preferredFit && { preferredFit: validated.preferredFit }),
      ...(validated.usualSizes && { usualSizes: validated.usualSizes }),
      ...(validated.preferredBrands && { preferredBrands: validated.preferredBrands })
    };

    user.profile = updatedProfile as any;
    await user.save();

    res.json({
      message: 'Profile updated successfully',
      profile: user.profile
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to update profile' });
  }
});

export default router;
