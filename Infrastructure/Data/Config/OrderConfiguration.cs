using Core.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Config
{
    public class OrderConfiguration : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {   
            // Configure the ShipToAddress property as an owned entity
            builder.OwnsOne(o => o.ShipToAddress, addressConfig =>
            {
                addressConfig.WithOwner();
            });

            // Configure the Status property for conversion between enum and s tring
            builder.Property(o => o.Status)
                .HasConversion(
                    // Convert the Status enum to a string when saving to the database
                    o => o.ToString(),
                    // Convert the string from the database back to the Status enum
                    o => (OrderStatus)Enum.Parse(typeof(OrderStatus), o)
                );

            // Configure the relationship between Order and OrderItem entities
            // Order can have many OrderItem
            builder.HasMany(o => o.OrderItems).WithOne().
            //Order is deleted, its associated OrderItem entities should also be deleted.
            OnDelete(DeleteBehavior.Cascade);
        }

    }   
}
