import { z } from 'zod';


export const employeeValidationSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email().max(255),  
  phone: z.number(),
  status: z.number().positive().max(2).min(1),
  roleId: z.number().positive().min(1),
});

export const employeeRoleValidationSchema = z.object({
  name: z.string().min(1).max(255),
});





