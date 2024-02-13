

using System.ComponentModel.DataAnnotations;

namespace Core.Entities.OrderAggregate
{
    public class ProductItemOrdered
    {
       
        public int ProductItemId { get; set; } 
        
        [MaxLength(255)]
        public string ProductName { get; set; }

        [MaxLength(255)]
        [Url]
        public string PictureUrl { get; set; } 

        public ProductItemOrdered()
        {
        }

        public ProductItemOrdered(int productId, string productName, string pictureUrl)
        {
            ProductItemId = productId;
            ProductName = productName;
            PictureUrl = pictureUrl;
        }
    }
}
