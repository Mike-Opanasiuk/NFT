using Core.Entities;
using Infrastructure.Data.EntitiesConfiguration.Abstract;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.EntitiesConfiguration;

internal class UserEntityConfiguration : BaseEntityConfiguration<UserEntity>
{
    public override void Configure(EntityTypeBuilder<UserEntity> builder)
    {
        base.Configure(builder);

        builder
            .HasMany(user => user.Tokens)
            .WithOne(token => token.Author);

        builder
            .HasMany(user => user.Collections)
            .WithOne(collection => collection.Author);
    }
}
