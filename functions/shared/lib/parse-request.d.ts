import type { z } from 'zod';
/**
 * Parse and validate callable request data using a Zod schema.
 * Converts Zod validation errors into Firebase HttpsError('invalid-argument').
 */
export declare function parseRequest<T>(data: unknown, schema: z.ZodType<T>): T;
