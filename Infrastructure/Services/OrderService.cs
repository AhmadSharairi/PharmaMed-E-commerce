using Core.Entites;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Specifications;


namespace Infrastructure.Services
{
    public class OrderService : IOrderService
    {


        private readonly IBasketRepository _basketRepo;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPaymentService _paymentService;

        public OrderService(IUnitOfWork unitOfWork, IBasketRepository basketRepo, IPaymentService paymentService)
        {
            _unitOfWork = unitOfWork;
            _basketRepo = basketRepo;
            _paymentService = paymentService;
         
        }

        public async Task<Order> CreateOrderAsync(string buyerEmail, int deliveryMethodId, string basketId, Address shippingAddress)
        {


            // Step 1: Retrieve the shopping basket
            var basket = await _basketRepo.GetBasketIdAsync(basketId);

            // Step 2: Initialize a list to store order items
            var orderItems = new List<OrderItem>();

            // Step 3: Iterate through each item in the basket
            foreach (var item in basket.Items)
            {
                // Step 3a: Retrieve the product item
                var productItem = await _unitOfWork.Repository<Product>().GetByIdAsync(item.Id);

                // Step 3b: Create an item ordered for the product
                var itemOrdered = new ProductItemOrdered(productItem.Id, productItem.Name, productItem.PictureUrl);

                // Step 3c: Create an order item and add it to the list
                var orderItem = new OrderItem(itemOrdered, productItem.Price, item.Quantity);
                orderItems.Add(orderItem);
            }

            // Step 4: Retrieve the delivery method
            var deliveryMethod = await _unitOfWork.Repository<DeliveryMethod>().GetByIdAsync(deliveryMethodId);

            // Step 5: Calculate the subtotal
            var subtotal = orderItems.Sum(item => item.Price * item.Quantity);


            // Step 6: check to see order exist 
            var spec = new OrderByPaymentIntentIdSpecification(basket.PaymentIntentId);
            var existingOrder = await _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);

            // This section deletes an existing order and creates a new one with an updated payment intent.
            if (existingOrder != null)
            {
                _unitOfWork.Repository<Order>().Delete(existingOrder);
                await _paymentService.CreateOrUpdatePaymentIntent(basket.PaymentIntentId);
            }

            // Step 7: Create the order
            var order = new Order(buyerEmail, shippingAddress, deliveryMethod, orderItems, subtotal, basket.PaymentIntentId);

            // Step 8: Add the order to the repository
            _unitOfWork.Repository<Order>().Add(order);

            // Step 9: Save changes to the database
            

            var result = await _unitOfWork.CompleteAsync();
          

            // Step 10: Check if the database operation was successful
            if (result <= 0)
            {
                return null;
            }

//Step 11: delete basket after  make order
             await _basketRepo.DeleteBasketAsync(basketId);

            // Step 12: Return the created order;
            return order;
        }

        public async Task<IReadOnlyList<Order>> GetOrdersForUsersAsync(string buyerEmail)
        {
            var ordersSpecification = new OrdersWithItemsAndOrderingSpecification(buyerEmail);
            var orders = await _unitOfWork.Repository<Order>().ListAsync(ordersSpecification);
            return orders;
        }


        public async Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodsAsync()
        {
            return await _unitOfWork.Repository<DeliveryMethod>().ListAllAsync();
        }

        public async Task<Order> GetOrderByIdAsync(int id, string buyerEmail)
        {
            var orderSpecification = new OrdersWithItemsAndOrderingSpecification(id, buyerEmail);
            var order = await _unitOfWork.Repository<Order>().GetEntityWithSpec(orderSpecification);
            return order;
        }

        public async Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail)
        {
            var spec = new OrdersWithItemsAndOrderingSpecification(buyerEmail);

            return await _unitOfWork.Repository<Order>().ListAsync(spec);

        }

    }
}