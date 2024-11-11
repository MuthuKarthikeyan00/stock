import { z } from 'zod';


export const employeeValidationSchema = z.object({
  firstNme: z.string().min(1).max(255),
  lastName: z.string().min(1).max(255),
  email: z.string().email().max(255),  
  phone: z.number().positive(),
  roleId: z.number().positive().min(1),
});

export const employeeRoleValidationSchema = z.object({
  name: z.string().min(1).max(255),
});





