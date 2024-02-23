interface ICustomError {
  message: string;
  path?: ReadonlyArray<string | number>;
  code: string

}

export function errorHandler(error: any): ICustomError {
  // Customize the format of errors returned to clients
  // console.error('Error:', error);
  // Optionally, you can return custom error messages to clients
  return {
    message: error.message,
    path: error.path,
    // status: ,
    code: error.extensions.code
    // customErrorCode: 'CUSTOM_ERROR_CODE' // TypeScript will raise an error here because customErrorCode is not defined in the CustomError interface
  };
}