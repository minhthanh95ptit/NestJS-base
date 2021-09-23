type HttpResponse = {
    error: boolean;
    statusCode: number;
    message?: string;
    data?: any;
};
  
export default HttpResponse;
  