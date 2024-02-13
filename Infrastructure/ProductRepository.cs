
using Core.Entites;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;


namespace Infrastructure.Data
{
    public class ProductRepository : IProductRepository
    {
        private readonly StoreContext _Dbcontext;

        public ProductRepository(StoreContext context)
        {
            _Dbcontext = context;

        }

        public async Task<Product> GetProductByIdAsync(int id)
        {
            return await _Dbcontext.Products
            .Include(p =>p.ProductType)
            .Include(p=> p.ProductBrand)
            .FirstOrDefaultAsync(p => p.Id ==id);
        }

        public async Task<IReadOnlyList<Product>> GetProductsAsync()
        {
            
            return await _Dbcontext.Products
            .Include(p =>p.ProductType)   // to prvent ProductType null value 
            .Include(p=> p.ProductBrand)
               .AsNoTracking().ToListAsync();
        }

        public async Task<IReadOnlyList<ProductType>> GetProductTypeAsync()
        {
            return await _Dbcontext.ProductTypes.AsNoTracking().ToListAsync();
        }

        public async Task<IReadOnlyList<ProductBrand>> GetProductBrandAsync()
        {
              return await _Dbcontext.ProductBrands.AsNoTracking().ToListAsync();
        }

    }
}


