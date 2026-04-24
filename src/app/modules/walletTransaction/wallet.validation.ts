import { z } from 'zod';

const createTransactionZodSchema = z.object({
  body: z.object({
    user: z.string().min(1, 'User ID is required'),
    type: z.enum(['credit', 'debit', 'withdrawal']),
    amount: z.number().min(0, 'Amount must be positive'),
    reason: z.enum(['venue_contribution_reward', 'withdrawal', 'bonus', 'refund']),
    contributionId: z.string().optional(),
    note: z.string().optional(),
  }),
});

export const WalletValidation = {
  createTransactionZodSchema,
};
