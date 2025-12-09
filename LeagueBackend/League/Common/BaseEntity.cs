using System;
using System.Collections.Generic;

namespace League.Domain.Common
{
    public abstract class BaseEntity
    {
        // CAMBIO IMPORTANTE: Quitamos 'protected' para que el DbContext pueda asignar IDs fijos
        public Guid Id { get; set; } = Guid.NewGuid();

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