using Core.Entities;
using Infrastructure.Repository.Abstract;

namespace Infrastructure.UnitOfWork.Abstract;

public interface IUnitOfWork
{
    IRepository<CollectionEntity> Collections { get; }
    IRepository<TokenEntity> Tokens { get; }

    Task<int> SaveChangesAsync();
}
