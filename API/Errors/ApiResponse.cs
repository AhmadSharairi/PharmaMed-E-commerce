
namespace API.Errors
{
    public class ApiResponse
    {
        public ApiResponse(int statusCode, string message = null, List<string> errors = null)
        {
            StatusCode = statusCode;
            Message = message ?? GetDefaultMessageForStatusCode(statusCode);
        }



        public int StatusCode { get; set; }
        public string Message { get; set; }



        private string GetDefaultMessageForStatusCode(int statusCode)
        {
            return statusCode switch
            {
                400 => "Bad Request: The server could not understand the request",
                401 => "Unauthorized: Authentication is required to access the resource",
                403 => "Forbidden: You don't have permission to access the resource",
                404 => "Not Found: The requested resource could not be found",
                500 => "Internal Server Error: An unexpected condition was encountered",
                _ => "Unknown status code"
            };

        }
    }
}