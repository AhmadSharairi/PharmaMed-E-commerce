using Core.Entities.Identity;

namespace API.Dtos
{
    public class UserDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public GenderType Gender { get; set; }
        public string Token { get; set; }
        
    }
}