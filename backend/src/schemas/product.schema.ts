import { z } from 'zod';

export const createProductSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters long' }),
  description: z.string().optional().default(''),
  price: z.number().positive({ message: 'Price must be greater than 0' }),
  minOrderQuantity: z.number().int().positive({ message: 'Minimum Order Quantity must be at least 1' }).default(1),
  unit: z.string().default('piece'),
  images: z.array(z.string()).optional().default([]),
  categoryId: z.string().optional(),
});

export const updateProductSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  minOrderQuantity: z.number().int().positive().optional(),
  unit: z.string().optional(),
  images: z.array(z.string()).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  categoryId: z.string().optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
