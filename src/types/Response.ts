export interface ResponseObject {
    success: boolean;
    message: string;
    error?: any;
    user?: any;
    data?: object | any[];
}
