using Microsoft.AspNetCore.Identity;

namespace Core.Entities
{       
    public class AppUser : IdentityUser
    {   

        
        public string DisplayName { get; set; }
        
         // Establish a one-to-one relationship with Address
        public Address Address { get; set; }
   
    }


}