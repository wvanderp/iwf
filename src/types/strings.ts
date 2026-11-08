import { z } from 'zod';

// Upstream models entity IDs as strings. These schemas preserve this library's
// narrower public types and its requirement for unsigned integer identifiers.
export const QStringSchema = z.templateLiteral(['Q', z.number()]).refine((id) => /^Q\d+$/.test(id));
export const PStringSchema = z.templateLiteral(['P', z.number()]).refine((id) => /^P\d+$/.test(id));
export const LStringSchema = z.templateLiteral(['L', z.number()]).refine((id) => /^L\d+$/.test(id));
export const EStringSchema = z.templateLiteral(['E', z.number()]).refine((id) => /^E\d+$/.test(id));
export const SenseStringSchema = z.templateLiteral(['L', z.number(), '-S', z.number()]).refine((id) => /^L\d+-S\d+$/.test(id));
export const FormStringSchema = z.templateLiteral(['L', z.number(), '-F', z.number()]).refine((id) => /^L\d+-F\d+$/.test(id));

export type QString = z.infer<typeof QStringSchema>;
export type PString = z.infer<typeof PStringSchema>;
export type LString = z.infer<typeof LStringSchema>;
export type EString = z.infer<typeof EStringSchema>;
export type SenseString = z.infer<typeof SenseStringSchema>;
export type FormString = z.infer<typeof FormStringSchema>;
