using Core.Entites;


namespace Core.Interfaces
{
    public interface IProductRepository
    {
        Task<Product> GetProductByIdAsync(int id);
        Task<IReadOnlyList<Product>>GetProductsAsync();     
        Task<IReadOnlyList<ProductType>>GetProductTypeAsync();     
        Task<IReadOnlyList<ProductBrand>>GetProductBrandAsync();     


    }
}
  