using API.Dtos;
using API.Errors;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;


namespace API.Controllers
{


    public class AccountController : BaseApiController
    {

        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        private readonly AppIdentityDbContext _appIdentityDbContext;


        public AccountController(UserManager<AppUser> userManger, SignInManager<AppUser> signInManager, 
        ITokenService tokenService, IMapper mapper, AppIdentityDbContext appIdentityDbContext)
        {

            _userManager = userManger;

            _signInManager = signInManager;

            _tokenService = tokenService;

            _mapper = mapper;

            _appIdentityDbContext = appIdentityDbContext;

        }



        [Authorize]
        [HttpGet("current-user")]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {

            var user = await _userManager.FindUserByClaimsPrincipalWithAddressAsync(HttpContext.User);

            return new UserDto
            {
                DisplayName = user.DisplayName,
                Email = user.Email,
                Token = _tokenService.CreateToken(user)
            };

        }


        [HttpGet("email-exists")]
        public async Task<ActionResult<bool>> CheackEmailExistAsync([FromQuery] string email)
        {
            var user = await _userManager.FindByEmailAsync(email);

            return user != null;

        }

        [Authorize]
        [HttpGet("user-address")]
        public async Task<ActionResult<AddressDto>> GetUserAddress()
        {

            var user = await _userManager.FindUserByClaimsPrincipalWithAddressAsync(HttpContext.User);

            if (user == null)
            {
                return NotFound();
            }


            return _mapper.Map<Address, AddressDto>(user.Address);
        }



        [Authorize]
        [HttpPut("update-address")]
        public async Task<ActionResult<AddressDto>> UpdateUserAddress(AddressDto address)
        {
            var user = await _userManager.FindUserByClaimsPrincipalWithAddressAsync(HttpContext.User);

            if (user == null)
            {
                return NotFound(); // User not found
            }

            // Attach the user's address to the DbContext
            _appIdentityDbContext.Attach(user.Address);

            // Map and update the user's address
            user.Address = _mapper.Map<AddressDto, Address>(address);

            // Save changes directly without relying on UpdateAsync
            await _appIdentityDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<Address, AddressDto>(user.Address));
        }





        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login([FromBody] LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password))
            {
                // Log this unsuccessful login attempt for rate limiting/account lockout tracking.
                // Implement rate limiting and account lockout logic here.
                return Unauthorized(new ApiResponse(401));
            }

            // Implement rate limiting logic here.
            // Track the number of login attempts for this user and apply rate limiting rules.

            if (await _userManager.IsLockedOutAsync(user))
            {
                // Account is locked due to too many failed login attempts.
                // Implement logic to return a specific response for locked accounts.
                return Unauthorized(new ApiResponse(401, "Account locked due to too many failed login attempts."));
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            if (!result.Succeeded)
            {
                // Log this unsuccessful login attempt for rate limiting/account lockout tracking.
                // Implement rate limiting and account lockout logic here.
                user.AccessFailedCount++; // Increase the count of failed login attempts for this user.
                

                if (user.AccessFailedCount >= 5)
                {
                    // Lock the account if the user exceeds a certain number of failed login attempts.
                    user.LockoutEnd = DateTimeOffset.UtcNow.AddMinutes(30); // Lock the account for 30 minutes.
                }

                await _userManager.UpdateAsync(user);

                return Unauthorized(new ApiResponse(401));
            }

            // Successful login, reset the failed login attempt cpUpdateAsynount.
            user.AccessFailedCount = 0;
            await _userManager.UpdateAsync(user);

            // Generate a secure JWT token here.
            var token = _tokenService.CreateToken(user);

            return new UserDto
            {
                DisplayName = user.DisplayName,
                Email = user.Email,
                Token = token
            };
        }


        [HttpPost("Register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {


            var emailExists = await CheackEmailExistAsync(registerDto.Email);

            if (emailExists.Value)
            {
                return new BadRequestObjectResult(new ApiValidationErrorResponse
                { Errors = new[] { "This email address is already registered. Please use a different one." } });
            }

            var user = new AppUser
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.Email
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description).ToList();
                return BadRequest(new ApiResponse(400, "User registration failed ", errors));
            }

            // Generate a secure token 
            var token = _tokenService.CreateToken(user);

            return new UserDto
            {
                DisplayName = user.DisplayName,
                Email = user.Email,
                Token = token
            };


        }



      






    }

























}

