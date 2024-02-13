using Core.Entites;

namespace Core.Entities.OrderAggregate
{
    public class Order : BaseEntity
    {
        private readonly decimal _tax = 0.16M;
        private readonly decimal _discount = 0.05M;


        public Order() { }
        public Order(string buyerEmail, Address shipToAddress, DeliveryMethod deliveryMethod,
                    IReadOnlyList<OrderItem> orderItems, decimal subtotal , string paymentIntentId)

        {

            BuyerEmail = buyerEmail;
            ShipToAddress = shipToAddress;
            DeliveryMethod = deliveryMethod;
            OrderItems = orderItems;
            Subtotal = subtotal;
            PaymentIntentId = paymentIntentId;

        }


        public string BuyerEmail { get; set; }

        public DateTimeOffset OrderTime { get; set; } = DateTimeOffset.Now;


        public Address ShipToAddress { get; set; }
        public DeliveryMethod DeliveryMethod { get; set; }

        public IReadOnlyList<OrderItem> OrderItems { get; set; }


        public decimal Subtotal { get; set; }
 
        public OrderStatus Status { get; set; } = OrderStatus.Pending;

        public string PaymentIntentId { get; set; }
        public decimal GetTotal()
        {
            decimal discountAmount = Subtotal * _discount;
            decimal amountBeforeTaxAndDiscount = Subtotal + DeliveryMethod.Price;
            decimal amountAfterDiscount = amountBeforeTaxAndDiscount - discountAmount;
            decimal taxAmount = amountAfterDiscount * _tax;

            decimal total = amountAfterDiscount + taxAmount;

            // Round the total to 2 decimal places
            total = Math.Round(total, 2);

            return total;
        }



    }
}