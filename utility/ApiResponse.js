class ApiResponse {
    constructor(statusCode, data = null , message = null) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.status = statusCode < 400 ? 'success' : 'error';
    }
}


export { ApiResponse };