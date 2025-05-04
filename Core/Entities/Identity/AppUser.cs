using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;

namespace Core.Entities
{       
    public class AppUser : IdentityUser
    {   

        
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public GenderType Gender { get; set; }
        
         //One-to-one relationship with Address
        public Address ShippingAddress { get; set; }
   
    }


}