using API.Errors;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stripe;
namespace API.Controllers
{
    public class PaymentsController : BaseApiController
    {
        private readonly IPaymentService _paymentService;
        private readonly ILogger<PaymentsController> _logger;
        private readonly string _whSercret ;


        public PaymentsController(IPaymentService paymentService, ILogger<PaymentsController> logger , IConfiguration configuration)
        {
            _logger = logger;
            _paymentService = paymentService;
            _whSercret = configuration.GetSection("StripeSettings:WhSecret").Value;

        }

        [Authorize]
        [HttpPost("{basketId}")]
        public async Task<ActionResult<CustomerBasket>> CreateOrUpdatePaymentIntent(string basketId)
        {
            try
            {
                var basket = await _paymentService.CreateOrUpdatePaymentIntent(basketId);

                if (basket == null)
                {

                    return BadRequest(new ApiResponse(400, "Problem with your basket"));
                }

                return Ok(basket);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating or updating payment intent");
                return StatusCode(500, new ApiResponse(500, "Internal Server Error"));
            }
        }



        // To enable webhook functionality and get WhSercret, follow these steps:
        // 1. Set up your webhook API.
        // 2. Download and install the Stripe CLI from the official GitHub repository step: https://github.com/stripe/stripe-cli.
        // 3. Obtain your webhook secret by executing the following commands in PowerShell:
        //      - stripe login
        //      - stripe listen
        // 4. In the shell, run the following command to configure the webhook for your local development environment:
        //      - stripe -f http://localhost:5245/api/Payments/webhook
        // This ensures that your application is ready to receive Stripe webhook events.

        [HttpPost("webhook")]
        public async Task<ActionResult> StripeWebhook()
        {
            try
            {
                var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
                var stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"], _whSercret);
                PaymentIntent paymentIntent;
                Order order = null;

                switch (stripeEvent.Type)
                {
                    case "payment_intent.succeeded":
                        paymentIntent = (PaymentIntent)stripeEvent.Data.Object;
                        _logger.LogInformation($"Payment Succeeded: {paymentIntent.Id}");
                        order = await _paymentService.UpdateOrderPaymentSucceeded(paymentIntent.Id);
                        _logger.LogInformation($"Order updated to payment received. OrderId: {order?.Id}");
                        break;

                    case "payment_intent.failed":
                        paymentIntent = (PaymentIntent)stripeEvent.Data.Object;
                        _logger.LogError($"Payment Failed: {paymentIntent.Id}");
                        order = await _paymentService.UpdateOrderPaymentFailed(paymentIntent.Id);
                        _logger.LogError($"Payment Failed. OrderId: {order?.Id}");
                        break;
                }


                // Response to acknowledge receipt of the webhook
                return new EmptyResult();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error processing Stripe webhook: {ex.Message}");


                return BadRequest(new { error = "Webhook processing failed", message = ex.Message });
            }
        }








    }


}