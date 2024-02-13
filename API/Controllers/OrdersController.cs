using Core.Entities.OrderAggregate;
using API.Dtos;
using API.Extentions;
using AutoMapper;


using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;

using Microsoft.AspNetCore.Mvc;
using API.Errors;


namespace API.Controllers
{
    [Authorize]
    public class OrdersController : BaseApiController
    {
        private readonly IOrderService _orderService;
        private readonly IMapper _mapper;
        public OrdersController(IOrderService orderService, IMapper mapper)
        {
            _orderService = orderService;
            _mapper = mapper;

        }


        [HttpPost("Create-Order")]
        public async Task<ActionResult<Order>> CreateOrder(OrderDto orderDto)
        {
            try
            {
                if (orderDto == null)
                {
                
                    return BadRequest(new { Status = 400, Message = "Invalid order data" });
                }

                // Input validation code goes here

                var email = HttpContext.User.RetrieveEmailFromPrincipal();
                var address = _mapper.Map<AddressDto, Address>(orderDto.ShipToAddress);
                var order = await _orderService.CreateOrderAsync(email, orderDto.DeliveryMethodId, orderDto.BasketId, address);


                if (order == null)
                {
                    return BadRequest(new { Status = 400, Message = "Failed to create the order" });
                }

                return Ok(new { Status = 200, Message = "Order created successfully", Data = order });
            }

            catch (Exception ex)
            {
                return StatusCode(500, new { Status = 500, Message = "Internal server error", Error = ex.Message });
            }


        }

        [HttpGet("Get-Orders")]
        public async Task<ActionResult<IReadOnlyList<OrderDto>>> GetOrdersForUser()
        {
            var email = HttpContext.User.RetrieveEmailFromPrincipal();
            var orders = await _orderService.GetOrdersForUsersAsync(email);

            return Ok(_mapper.Map<IReadOnlyList<Order> ,IReadOnlyList<OrderToReturnDto>>(orders));

        }


        [HttpGet("OrderIdForUser/{id}")]

        public async Task<ActionResult<OrderToReturnDto>> GetOrderByIdForUser(int id)
        {

            var email = HttpContext.User.RetrieveEmailFromPrincipal();

            var order = await _orderService.GetOrderByIdAsync(id, email);

            if (order == null) return NotFound(new ApiResponse(404));


            return _mapper.Map<Order , OrderToReturnDto>(order);

        }

        [HttpGet("DeliveryMethods")]
        public async Task<ActionResult<DeliveryMethod>> GetDeliveryMethods()
        {
            var deliveryMethods = await _orderService.GetDeliveryMethodsAsync();

            return Ok(deliveryMethods);
        }








    }

}