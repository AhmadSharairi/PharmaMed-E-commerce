using System.Security.Claims;
using Core.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

public static class UserManagerExtension
{
    public static async Task<AppUser> FindUserByClaimsPrincipalWithAddressAsync(
        this UserManager<AppUser> userManager, ClaimsPrincipal user)
    {
        var emailClaim = user?.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Email);
        
        if (emailClaim == null || string.IsNullOrEmpty(emailClaim.Value))
        {
            return null; 
        }

        return await userManager.Users.Include(x => x.Address)
            .SingleOrDefaultAsync(x => x.Email == emailClaim.Value);
    }

    public static async Task<AppUser> FindByEmailFromClaimsPrincipal(
        this UserManager<AppUser> userManager, ClaimsPrincipal user)
    {
        var emailClaim = user?.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Email);
        
        if (emailClaim == null || string.IsNullOrEmpty(emailClaim.Value))
        {
            return null; // User not found if email claim is missing or empty
        }

        return await userManager.Users
            .SingleOrDefaultAsync(x => x.Email == emailClaim.Value);
    }
}
