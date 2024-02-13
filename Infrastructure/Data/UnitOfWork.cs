using System.Collections;
using Core.Entites;
using Core.Interfaces;
using Infrastructure.Data;

namespace Core.Entities.OrderAggregate
{
    // This is a Repository design pattern implementation using the Unit of Work pattern.
    public class UnitOfWork : IUnitOfWork
    {
        private readonly StoreContext _storeContext;

        private Hashtable _repositories;
        public UnitOfWork(StoreContext storeContext)
        {

            _storeContext = storeContext;

        }

        // Generic method for getting a repository for a specific entity type.
        public IGenericRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity
        {
            if (_repositories == null)
            {
                _repositories = new Hashtable();
            }


            var type = typeof(TEntity).Name;

            if (!_repositories.ContainsKey(type))
            {
                var repositoryType = typeof(GenericRepository<>);
                var repositoryInstance = Activator.CreateInstance(repositoryType.MakeGenericType(typeof(TEntity)), _storeContext);
                _repositories.Add(type, repositoryInstance);
            }

            return (IGenericRepository<TEntity>)_repositories[type];
        }

        // Method for saving changes to the database asynchronously.
        public async Task<int> CompleteAsync()
        {
            
            return await _storeContext.SaveChangesAsync();
        }


        // Method for disposing of the context.
        public void Dispose()
        {
            _storeContext.Dispose();
        }


        


    }
}