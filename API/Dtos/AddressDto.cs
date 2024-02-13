using System.ComponentModel.DataAnnotations;

namespace API.Dtos
{
    public class AddressDto
    {
        
        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        [Required]
        public string LocationAddress { get; set; }

        [Required]
        public string City { get; set; }

        public string State { get; set; }

     
        [RegularExpression(@"^\d{5}$", ErrorMessage = "Invalid Zip Code")]
        public string ZipCode { get; set; }

        [Required]
        public string Country { get; set; }

        [Phone]
        public string PhoneNumber { get; set; }
    }
}
