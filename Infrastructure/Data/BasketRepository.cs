using System.Text.Json;
using Core.Entities;
using Core.Interfaces;
using StackExchange.Redis;

namespace Infrastructure.Data
{

    public class BasketRepository : IBasketRepository
    {
        private readonly IDatabase _database;

        public BasketRepository(IConnectionMultiplexer redis)
        {
            _database = redis.GetDatabase();
        }


        public async Task<bool> DeleteBasketAsync(string basketId)
        {
            return await _database.KeyDeleteAsync(basketId);
        }


        public async Task<IEnumerable<CustomerBasket>> GetAllBasketsAsync()
        {
            // Retrieve all keys matching the specified pattern (in this case, all keys)
            var allKeysResult = _database.Execute("KEYS", "*");

            if (allKeysResult == null || allKeysResult.IsNull)
            {
                return Enumerable.Empty<CustomerBasket>();
            }

            var allKeys = (string[])allKeysResult;

            // Fetch the baskets corresponding to the retrieved keys
            var baskets = await Task.WhenAll(allKeys.Select(key => GetBasketIdAsync(key)));

            return baskets.Where(basket => basket != null);
        }


        public async Task<CustomerBasket> GetBasketIdAsync(string basketId)
        {
            var data = await _database.StringGetAsync(basketId);

            return data.IsNullOrEmpty ? null : JsonSerializer.Deserialize<CustomerBasket>(data);
        }


        public async Task<CustomerBasket> UpdateBasketAsync(CustomerBasket basket)
        {
            var created = await _database.StringSetAsync(
                basket.Id,
                JsonSerializer.Serialize(basket),
                TimeSpan.FromDays(30)
            );

            if (!created) return null;

            return await GetBasketIdAsync(basket.Id);
        }



    }
}
