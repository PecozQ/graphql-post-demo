class CustomError extends Error {
    constructor(message: string) {
      super(message);
      this.name = this.constructor.name;
    }
}
  
export class InputError extends CustomError {
    module: string;

    constructor(message: string, module: string) {
        super(`Input error in module ${module}: ${message}`);
        this.module = module;
    }
}
  
export class DatabaseError extends CustomError {
    constructor(message: string) {
        super(`Database error: ${message}`);
    }
}
