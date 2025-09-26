using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{
    public class Template
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Content { get; set; }
        public string? jsonschema { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
