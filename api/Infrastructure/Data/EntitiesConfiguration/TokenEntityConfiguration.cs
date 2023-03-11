using Core.Entities;
using Infrastructure.Data.EntitiesConfiguration.Abstract;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using static Shared.AppConstant;

namespace Infrastructure.Data.EntitiesConfiguration;

internal class TokenEntityConfiguration : BaseEntityConfiguration<TokenEntity>
{
    public override void Configure(EntityTypeBuilder<TokenEntity> builder)
    {
        base.Configure(builder);

        builder
            .Property(p => p.Name)
            .HasMaxLength(Length.L2)
            .IsRequired();

        builder
            .Property(p => p.Description)
            .HasMaxLength(Length.L5);

        builder
            .HasOne(token => token.Author)
            .WithMany(user => user.Tokens);

        builder
            .HasOne(token => token.Collection)
            .WithMany(collection => collection.Tokens);
    }
}