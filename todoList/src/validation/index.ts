import { z , ZodType } from 'zod';
import { FormData } from '../App';

export const ValidationSchema  :ZodType<FormData>  =z.object(  {
  todoText: z
    .string()
    .min(3)
    .max(20)
});

type ValidationSchema  = z.infer<typeof ValidationSchema>



