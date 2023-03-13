using Core.Entities;
using Infrastructure.Repository;
using Infrastructure.Repository.Abstract;
using Infrastructure.UnitOfWork.Abstract;

namespace Infrastructure.UnitOfWork;

public class UnitOfWork : IUnitOfWork, IDisposable
{
    private readonly ApplicationDbContext context;

    public IRepository<CollectionEntity> Collections { get; }

    public IRepository<TokenEntity> Tokens { get; }

    public UnitOfWork(ApplicationDbContext context)
    {
        this.context = context;

        Tokens = new Repository<TokenEntity>(context);
        Collections = new Repository<CollectionEntity>(context);
    }

    public void Dispose()
    {
        context.Dispose();
    }

    public async Task<int> SaveChangesAsync()
    {
        return await context.SaveChangesAsync();
    }
}
