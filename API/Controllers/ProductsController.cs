
using API.Dtos;
using API.Errors;
using API.Helpers;
using AutoMapper;
using Core.Entites;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Mvc;


namespace API.Controllers
{

    public class ProductsController : BaseApiController
    {

        private readonly IGenericRepository<Product> _ProductsRepo;
        private readonly IGenericRepository<ProductType> _ProductTypeRepo;
        private readonly IGenericRepository<ProductBrand> _ProductBrandRepo;
        private readonly IMapper _mapper;
        public ProductsController(
            IGenericRepository<Product> ProductsRepo,
            IGenericRepository<ProductBrand> ProductsBrandRepo,
            IGenericRepository<ProductType> ProductTypeRepo, IMapper mapper)   // use Generic Repo Pattren Here
        {
            _ProductsRepo = ProductsRepo;
            _ProductTypeRepo = ProductTypeRepo;
            _ProductBrandRepo = ProductsBrandRepo;
            _mapper = mapper;

        }
         [Cached(600)]
        [HttpGet]
        public async Task<ActionResult<Pagination<ProductToReturnDto>>> GetProducts(
            [FromQuery] ProductSpecParams productParams)
        {
            var spec = new ProductsWithTypesAndBrandsSpecification(productParams);

            var countSpec = new ProductsWithFiltersForCountSpecification(productParams);




            var totalItems = await _ProductsRepo.CountAsync(countSpec);
            var products = await _ProductsRepo.ListAsync(spec);
            var productsToReturn = _mapper.Map<IReadOnlyList<Product>, IReadOnlyList<ProductToReturnDto>>(products);
            var pagination = new Pagination<ProductToReturnDto>(productParams.PageIndex, productParams.PageSize, totalItems, productsToReturn);
            return Ok(pagination);


        }

         [Cached(600)]
        [HttpGet("{id}")] 
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ProductToReturnDto>> GetProduct(int id)
        {

            var spec = new ProductsWithTypesAndBrandsSpecification(id);
            var product = await _ProductsRepo.GetEntityWithSpec(spec);
            if (product == null) return NotFound(new ApiResponse(404));


            return _mapper.Map<Product, ProductToReturnDto>(product);
            //<source,   destination>(sourceOBJ) ex: destination = source;

        }


         [Cached(600)]
        [HttpGet("Brands")]
        public async Task<ActionResult<IReadOnlyList<ProductBrand>>> GetProductBrand()
        {
            return Ok(await _ProductBrandRepo.ListAllAsync());

        }
        [Cached(600)]
        [HttpGet("types")]
        public async Task<ActionResult<IReadOnlyList<ProductType>>> GetProductTypes()
        {

            return Ok(await _ProductTypeRepo.ListAllAsync());
        }


    }
}
