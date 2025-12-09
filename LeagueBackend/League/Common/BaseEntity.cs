using System;
using System.Collections.Generic;

namespace League.Domain.Common
{
    /// <summary>
    /// Base entity con Id, timestamps y soporte simple para domain events.
    /// </summary>
    public abstract class BaseEntity
    {
        public Guid Id { get; protected set; } = Guid.NewGuid();
        public DateTime CreatedAt { get; protected set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; protected set; }

        private readonly List<object> _domainEvents = new();
        public IReadOnlyCollection<object> DomainEvents => _domainEvents.AsReadOnly();

        protected void AddDomainEvent(object @event) => _domainEvents.Add(@event);
        protected void RemoveDomainEvent(object @event) => _domainEvents.Remove(@event);
        public void ClearDomainEvents() => _domainEvents.Clear();

        protected void Touch() => UpdatedAt = DateTime.UtcNow;
    }
}
