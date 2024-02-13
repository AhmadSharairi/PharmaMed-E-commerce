using System.ComponentModel.DataAnnotations;


namespace Core.Entites
{
    public class Product : BaseEntity
    {
        [MaxLength(255)]
        public string Name { get; set; }

        [MaxLength(1000)]
        public string Description { get; set; }


        public decimal Price { get; set; }

        [MaxLength(255)]
        [Url]
        public string PictureUrl { get; set; }

        public ProductType ProductType { get; set; }


        public int ProductTypeId { get; set; }

        public ProductBrand ProductBrand{ get; set; }


        public int ProductBrandId { get; set; }

    }

}

