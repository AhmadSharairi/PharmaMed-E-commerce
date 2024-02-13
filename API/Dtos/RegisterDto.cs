using System.ComponentModel.DataAnnotations;

namespace API.Dtos;
    
    public class RegisterDto
    { 
        [StringLength(20, MinimumLength = 6, ErrorMessage = "Display Name must be between 6 and 20 characters.")]
        public string DisplayName { get; set; }
        

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password is required")]    
        [RegularExpression(@"^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{"":;'?/>.<,])(?!.*\s).{8,100}$",
        ErrorMessage = "Password must contain at least one uppercase, one lowercase, one number, one special character, and more than 8 characters long.")]


        public string Password { get; set; }
    }
