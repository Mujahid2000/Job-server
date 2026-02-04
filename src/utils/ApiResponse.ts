class ApiResponse {
    statusCode: number;
    data: any;
    message: string;
    success: boolean;

    constructor(statusCode: number, data: any, message: string = "Success", success: number) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = success < 400;

    }
}