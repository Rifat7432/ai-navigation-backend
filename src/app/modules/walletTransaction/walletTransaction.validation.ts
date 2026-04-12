import { z } from 'zod';

const createWalletTransactionZodSchema = z.object({
     body: z.object({
          user: z.string({ required_error: 'User ID is required' }),
          type: z.enum(['credit', 'debit', 'withdrawal'], { required_error: 'Type is required' }),
          amount: z.number({ required_error: 'Amount is required' }),
          balanceAfter: z.number({ required_error: 'Balance after is required' }),
          reason: z.enum(['venue_contribution_reward', 'withdrawal', 'bonus', 'refund'], { required_error: 'Reason is required' }),
          contributionId: z.string().optional(),
          note: z.string().optional(),
     }),
});

const updateWalletTransactionZodSchema = z.object({
     body: z.object({
          user: z.string().optional(),
          type: z.enum(['credit', 'debit', 'withdrawal']).optional(),
          amount: z.number().optional(),
          balanceAfter: z.number().optional(),
          reason: z.enum(['venue_contribution_reward', 'withdrawal', 'bonus', 'refund']).optional(),
          contributionId: z.string().optional(),
          note: z.string().optional(),
     }),
});

export const WalletTransactionValidation = {
     createWalletTransactionZodSchema,
     updateWalletTransactionZodSchema,
};