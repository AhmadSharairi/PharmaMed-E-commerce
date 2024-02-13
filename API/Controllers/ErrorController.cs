using API.Errors;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("errors/{code}")]
    [ApiExplorerSettings(IgnoreApi = true)] // Exclude from API documentation
    public class ErrorController : BaseApiController
    {
        private readonly ILogger<ErrorController> _logger;

        public ErrorController(ILogger<ErrorController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IActionResult Error(int code)
        {
            string message;
            switch (code)
            {
                case 404:
                    message = "Resource not found.";
                    break;
                case 401:
                    message = "Unauthorized. Please log in.";
                    break;
                default:
                    message = "An error occurred.";
                    break;
            }

            // Log the error
            _logger.LogError($"HTTP {code}: {message}");

            var errorResponse = new ApiResponse(code, message);
            return new ObjectResult(errorResponse);
        }
    }
}
