using System.ComponentModel.DataAnnotations;

namespace Core.Entities
{
    public class Address
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string FirstName { get; set; }

        [Required]
        [MaxLength(50)]
        public string LastName { get; set; }

        [Required]
        [MaxLength(255)]
        public string LocationAddress { get; set; }

        [Required]
        [MaxLength(50)]
        public string City { get; set; }

        [MaxLength(50)]
        public string State { get; set; }

  
        [MaxLength(5)]
        public string ZipCode { get; set; }

        [Required]
        [MaxLength(50)]
        public string Country { get; set; }

        [Required]
        [MaxLength(15)]
        public string PhoneNumber { get; set; }



        // Foreign key to link to AppUser
       public string UserId { get; set; } //address.UserId = AppUser.Id
        public AppUser User { get; set; } 
    }
}
