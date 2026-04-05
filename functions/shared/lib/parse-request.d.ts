/**
 * Parse and validate callable request data using a Zod schema.
 * Converts Zod validation errors into Firebase HttpsError('invalid-argument').
 */
export declare function parseRequest<T>(
  data: unknown,
  schema: {
    safeParse(data: unknown):
      | {
          success: true;
          data: T;
        }
      | {
          success: false;
          error: {
            issues: Array<{
              path: PropertyKey[];
              message: string;
              code: string;
            }>;
          };
        };
  }
): T;
