using League.Domain.Common;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace League.Domain.Entities
{
    public class Role : BaseEntity
    {
        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? Description { get; set; }

        // Navigation Property
        public ICollection<User> Users { get; set; } = new List<User>();
    }
}