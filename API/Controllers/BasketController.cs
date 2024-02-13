using API.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{ //if shutdown the redis Run This Command and want to Reconnect with redis-cli command -Enter this-->  redis-server --daemonize yes
    public class BasketController : BaseApiController
    {
        private readonly IBasketRepository _basketRepository;
        private readonly IMapper _mapper;
        public BasketController(IBasketRepository basketRepository, IMapper mapper)
        {
            _mapper = mapper;
            _basketRepository = basketRepository;
        }

        [HttpGet("AllBaskets")]
        public async Task<ActionResult<IEnumerable<CustomerBasket>>> GetAllBaskets()
        {
            var baskets = await _basketRepository.GetAllBasketsAsync();
            if(baskets == null)
            {
                return NotFound("Basket is Empty");
            }
            return Ok(baskets);
        }



        [HttpGet("GetBasketById")]
        public async Task<ActionResult<CustomerBasket>> GetBasketById(string id)
        {
            var basket = await _basketRepository.GetBasketIdAsync(id);

            return Ok(basket);
        }


        [HttpPost("update-basket")]
        public async Task<ActionResult<CustomerBasket>> UpdateBasket(CustomerBasketDto basket)
        {
            var customerBasket = _mapper.Map<CustomerBasketDto, CustomerBasket>(basket);         

            var updatedBasket = await _basketRepository.UpdateBasketAsync(customerBasket);

            return Ok(updatedBasket);
        }


        [HttpDelete("DeleteBasket")]
        public async Task<IActionResult> DeleteBasketAsync(string id)
        {
            var basket = await _basketRepository.GetBasketIdAsync(id);

            if (basket == null)
            {
                return NotFound("Product Not found");
            }

            await _basketRepository.DeleteBasketAsync(id);

            return Ok("Deleted Successfully");
        }

    }
}