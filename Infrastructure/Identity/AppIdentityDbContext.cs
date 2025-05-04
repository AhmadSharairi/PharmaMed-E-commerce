using Core.Entities;
using Infrastructure.Data.Config;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Identity
{

 
                        
  public class AppIdentityDbContext : IdentityDbContext<AppUser>
  { 
 

    public AppIdentityDbContext(DbContextOptions<AppIdentityDbContext> options) :
    base(options)
    {
    }


    /*Fluent API*/

    protected override void OnModelCreating(ModelBuilder builder)
    {

         base.OnModelCreating(builder);
         builder.ApplyConfiguration(new GenderConfiguration());
          
    }

  }
  
  }