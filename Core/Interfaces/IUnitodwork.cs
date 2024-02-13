
using Core.Entites;

namespace Core.Interfaces

{    // This is a Repository design pattern implementation using the Unit of Work pattern.
    public interface IUnitOfWork : IDisposable
    {
        IGenericRepository<TEntity> Repository<TEntity>()where TEntity : BaseEntity;
        Task <int> CompleteAsync();
        
    }
}