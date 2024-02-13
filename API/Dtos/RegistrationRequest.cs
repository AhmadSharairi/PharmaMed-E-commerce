using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Dtos
{
    public class RegistrationRequest
    {
         public RegisterDto RegisterDto { get; set; }
         public AddressDto AddressDto { get; set; }
    }
}