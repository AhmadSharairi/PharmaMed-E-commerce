using System.ComponentModel.DataAnnotations;
using Core.Entities.Identity;

namespace API.Dtos;

public class RegisterDto
{
    [Required(ErrorMessage = "First name is required")]
    public string FirstName { get; set; }

    [Required(ErrorMessage = "Last name is required")]
    public string LastName { get; set; }


    [Required(ErrorMessage = "Gender is required")]
    public GenderType Gender { get; set; }


    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string Email { get; set; }

    [Required(ErrorMessage = "Password is required")]
    [RegularExpression(@"^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{"":;'?/>.<,])(?!.*\s).{8,100}$",
    ErrorMessage = "Password must contain at least one uppercase, one lowercase, one number, one special character, and more than 8 characters long.")]

    public string Password { get; set; }
}
