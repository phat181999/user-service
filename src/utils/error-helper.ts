export class Utils {
  constructor() {}

  throwIfMissing(field: string, value: any): void {
    if (!value) {
      throw new Error(`${field} is required`);
    }
  }

  handleError(context: string, error: unknown): never {
    const errorMsg = error instanceof Error ? error.message : String(error);
    throw new Error(`Error ${context}: ${errorMsg}`);
  }
}
