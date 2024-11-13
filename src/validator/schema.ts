import { z } from 'zod';


export const employeeValidationSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email().max(255),  
  phone: z.number(),
  branchId: z.number().positive().min(1),
  roleId: z.number().positive().min(1),
});

export const assetValidationSchema = z.object({
  name: z.string().min(1).max(255),
  model: z.string().min(1).max(255),
  serialNumber:z.string().min(1).max(255),
  typeId: z.number().positive().min(1),
  categoryId: z.number().positive().min(1),
});

export const employeeRoleValidationSchema = z.object({
  name: z.string().min(1).max(255),
});

export const AssetTransactionValidationSchema = z.object({
  assetId: z.number().positive().min(1),
  employeeId: z.number().positive().min(1),
  transactionType: z.number().positive().min(1),
  reason: z.string().min(1).max(255).nullable(),
});




