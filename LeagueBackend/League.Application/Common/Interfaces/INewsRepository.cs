using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using League.Domain.Entities;

namespace League.Application.Common.Interfaces
{
    public interface INewsRepository
    {
        Task<News> GetByIdAsync(Guid id);
        Task<List<News>> GetAllAsync();
        Task AddAsync(News news);
        Task UpdateAsync(News news);
        Task DeleteAsync(Guid id);
    }
}
