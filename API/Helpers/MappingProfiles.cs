using API.Dtos;
using AutoMapper; // Make sure to download the package: automapper.extensions.microsoft.dependencyinjection
using Core.Entites;
using Core.Entities;
using Core.Entities.OrderAggregate;

namespace API.Helpers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            // Mapping from Product to ProductToReturnDto
            CreateMap<Product, ProductToReturnDto>()
                .ForMember(d => d.ProductBrand, o => o.MapFrom(s => s.ProductBrand.Name)) // Map ProductBrand property
                .ForMember(d => d.ProductType, o => o.MapFrom(s => s.ProductType.Name)) // Map ProductType property
                .ForMember(d => d.PictureUrl, o => o.MapFrom<ProductUrlResolver>()); // Map PictureUrl using ProductUrlResolver


            // Mapping from Address to AddressDto and reverse
            CreateMap<Core.Entities.Address, AddressDto>().ReverseMap();

            // Mapping from CustomerBaskerDto to CustomerBasket
            CreateMap<CustomerBasketDto, CustomerBasket>();

            // Mapping from BasketItemDto to BasketItem
            CreateMap<BasketItemDto, BasketItem>();

            // Mapping from AddressDto to Core.Entities.OrderAggregate.Address
            CreateMap<AddressDto, Core.Entities.OrderAggregate.Address>();

            // Mapping from Order to OrderToReturnDto
            CreateMap<Order, OrderToReturnDto>()
                .ForMember(d => d.DeliveryMethod, o => o.MapFrom(s => s.DeliveryMethod.ShortName)) // Map DeliveryMethod property
                .ForMember(d => d.ShippingPrice, o => o.MapFrom(s => s.DeliveryMethod.Price)); // Map ShippingPrice property

            // Mapping from OrderItem to OrderItemDto
            CreateMap<OrderItem, OrderItemDto>()
                .ForMember(d => d.ProductId, o => o.MapFrom(s => s.ItemOrdered.ProductItemId)) // Map ProductId property
                .ForMember(d => d.ProductName, o => o.MapFrom(s => s.ItemOrdered.ProductName)) // Map ProductName property
                .ForMember(d => d.PictureUrl, o => o.MapFrom(s => s.ItemOrdered.PictureUrl)) // Map PictureUrl property
                .ForMember(d => d.PictureUrl, o => o.MapFrom<OrderUrlResolver>()); // Map PictureUrl using OrderUrlResolver
        }
    }
}
