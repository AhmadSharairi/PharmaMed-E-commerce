using Core.Entities;

namespace Core.Interfaces
{
    public interface IBasketRepository 
    {

        Task<IEnumerable<CustomerBasket>> GetAllBasketsAsync();
        Task<CustomerBasket> GetBasketIdAsync(string basketId);
        Task<CustomerBasket> UpdateBasketAsync(CustomerBasket basket); 
        Task<bool> DeleteBasketAsync(string basketId); 

    }
} 