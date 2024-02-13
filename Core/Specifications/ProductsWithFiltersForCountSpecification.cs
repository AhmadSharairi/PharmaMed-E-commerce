using Core.Entites;


namespace Core.Specifications
{
    public class ProductsWithFiltersForCountSpecification : BaseSpecification<Product>
    {
        public ProductsWithFiltersForCountSpecification(ProductSpecParams productParams) : base(x =>
           //Language Integrated Query-(LINQ)-based query
          (string.IsNullOrEmpty(productParams.Search) || x.Name.ToLower().Contains(productParams.Search) ||
           x.Description.ToLower().Contains(productParams.Search)) &&
             
            (!productParams.BrandId.HasValue || x.ProductBrandId == productParams.BrandId) &&
            (!productParams.TypeId.HasValue || x.ProductTypeId == productParams.TypeId))
        {

        }
    }
}