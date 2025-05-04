using Core.Entities;
using Core.Entities.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Config
{
    public class GenderConfiguration : IEntityTypeConfiguration<AppUser>
    {
        public void Configure(EntityTypeBuilder<AppUser> builder)
        {
            builder.Property(user => user.Gender)
                .HasConversion(
                
                    gender => gender.ToString(),  // enum -> string for DB
                    genderString => ConvertToGender(genderString)  // string from DB -> enum
                );
        }
 
        private GenderType ConvertToGender(string genderString)
        {
            if (Enum.TryParse<GenderType>(genderString, out var gender))
            {
                return gender;
            }
            else
            {
    
                throw new InvalidOperationException($"Invalid value '{genderString}' for enum type 'GenderType'");
            }
        }
    }
}
