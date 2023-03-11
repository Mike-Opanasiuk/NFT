using Core.Entities;
using Infrastructure.Data.EntitiesConfiguration.Abstract;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using static Shared.AppConstant;

namespace Infrastructure.Data.EntitiesConfiguration;

internal class CollectionEntityConfiguration : BaseEntityConfiguration<CollectionEntity>
{
    public override void Configure(EntityTypeBuilder<CollectionEntity> builder)
    {
        base.Configure(builder);

        builder
            .Property(p => p.Name)
            .HasMaxLength(Length.L2)
            .IsRequired();

        builder
            .HasOne(c => c.Author)
            .WithMany(a => a.Collections)
            .IsRequired();

        builder
            .HasMany(c => c.Tokens)
            .WithOne(t => t.Collection)
            .IsRequired();
    }
}