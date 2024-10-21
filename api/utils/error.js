export const errorhandler = (statusCode,message) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.message = message;
    return error;
}
