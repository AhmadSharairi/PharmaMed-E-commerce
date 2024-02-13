using Core.Entites;

namespace Core.Entities.OrderAggregate
{
    public class DeliveryMethod : BaseEntity
    {
        public string ShortName { get; set; }           
        public string DeliverTime { get; set; }     
         public decimal Price { get; set; }        
        public string Description { get; set; }           
                
    }
}