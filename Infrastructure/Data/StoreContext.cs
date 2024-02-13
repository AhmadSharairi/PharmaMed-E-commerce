using Microsoft.EntityFrameworkCore;
using Core.Entites;
using Core.Entities.OrderAggregate;


namespace Infrastructure.Data
{
    public class StoreContext : DbContext
    {
        public StoreContext(DbContextOptions<StoreContext> options) : base(options) { }

        public DbSet<Product> Products { get; set; }
        public DbSet<ProductBrand> ProductBrands { get; set; }

                                  
        public DbSet<ProductType> ProductTypes { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<DeliveryMethod> DeliveryMethods { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Order>().OwnsOne(x => x.ShipToAddress);

            modelBuilder.Entity<OrderItem>().OwnsOne(o => o.ItemOrdered); // Composition relationship

            modelBuilder.Entity<Product>().Property(p => p.Name).HasMaxLength(255);
            modelBuilder.Entity<Product>().Property(p => p.Description).HasMaxLength(1000);

            modelBuilder.Entity<Product>().Property(p => p.PictureUrl).HasMaxLength(255);

            modelBuilder.Entity<Product>().Property(p => p.Price).HasColumnType("decimal(18, 2)");
            base.OnModelCreating(modelBuilder);


        }
    }
}
