using System.ComponentModel.DataAnnotations;

namespace API.Dtos
{
    public class ResetPasswordDto
    {
        [EmailAddress]
        public string Email { get; set; }

        public string Token { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        public string Password { get; set; }

    }
}