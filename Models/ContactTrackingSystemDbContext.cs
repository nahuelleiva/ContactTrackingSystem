using Microsoft.EntityFrameworkCore;

namespace ContactTrackingSystem.Models
{
    public class ContactTrackingSystemDbContext : DbContext
    {
        public DbSet<Contact> Contacts { get; set; }
        public ContactTrackingSystemDbContext(DbContextOptions<ContactTrackingSystemDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Contact>().HasKey(e => e.Id);
        }
    }
}
