using Core.Entities.Abstract;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.EntitiesConfiguration.Abstract;

internal class BaseEntityConfiguration<TEntity>
    : IEntityTypeConfiguration<TEntity> where TEntity : class, IEntity
{
    public virtual void Configure(EntityTypeBuilder<TEntity> builder)
    {
        builder.HasKey(k => k.Id);

        builder.Property(u => u.CreatedAt).HasDefaultValueSql("getutcdate()").ValueGeneratedOnAdd();
        builder.Property(u => u.UpdatedAt).HasDefaultValueSql("getutcdate()").ValueGeneratedOnAddOrUpdate();
    }
}
