using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace MasterPieceApi.Models;

public partial class MyDbContext : DbContext
{
    public MyDbContext()
    {
    }

    public MyDbContext(DbContextOptions<MyDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<AdminChat> AdminChats { get; set; }

    public virtual DbSet<Booking> Bookings { get; set; }

    public virtual DbSet<ContactMessage> ContactMessages { get; set; }

    public virtual DbSet<JoinRequest> JoinRequests { get; set; }

    public virtual DbSet<Offer> Offers { get; set; }

    public virtual DbSet<Payment> Payments { get; set; }

    public virtual DbSet<Profile> Profiles { get; set; }

    public virtual DbSet<Review> Reviews { get; set; }

    public virtual DbSet<Service> Services { get; set; }

    public virtual DbSet<ServiceDetail> ServiceDetails { get; set; }

    public virtual DbSet<ServicesGallery> ServicesGalleries { get; set; }

    public virtual DbSet<TourismStatistic> TourismStatistics { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=DESKTOP-QJHUPSA;Database=MASTER_PEICE;Trusted_Connection=True;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AdminChat>(entity =>
        {
            entity.HasKey(e => e.ChatId).HasName("PK__AdminCha__A9FBE62614FF1E04");

            entity.Property(e => e.ChatId).HasColumnName("ChatID");
            entity.Property(e => e.AdminId).HasColumnName("AdminID");
            entity.Property(e => e.Message).HasColumnType("text");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.User).WithMany(p => p.AdminChats)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__AdminChat__UserI__5441852A");
        });

        modelBuilder.Entity<Booking>(entity =>
        {
            entity.HasKey(e => e.BookingId).HasName("PK__Bookings__73951ACDA45BA0E8");

            entity.Property(e => e.BookingId).HasColumnName("BookingID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ServiceId).HasColumnName("ServiceID");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("pending");
            entity.Property(e => e.TotalAmount).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.Service).WithMany(p => p.Bookings)
                .HasForeignKey(d => d.ServiceId)
                .HasConstraintName("FK__Bookings__Servic__59FA5E80");

            entity.HasOne(d => d.User).WithMany(p => p.Bookings)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Bookings__UserID__59063A47");
        });

        modelBuilder.Entity<ContactMessage>(entity =>
        {
            entity.HasKey(e => e.MessageId).HasName("PK__ContactM__C87C037C6897267B");

            entity.Property(e => e.MessageId).HasColumnName("MessageID");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Message).HasColumnType("text");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("new");
            entity.Property(e => e.Subject)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.SubmittedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.User).WithMany(p => p.ContactMessages)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK_UserID");
        });

        modelBuilder.Entity<JoinRequest>(entity =>
        {
            entity.HasKey(e => e.RequestId).HasName("PK__JoinRequ__33A8519A31C7D1E2");

            entity.Property(e => e.RequestId).HasColumnName("RequestID");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Message).HasColumnType("text");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Phone)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.ServiceImage).IsUnicode(false);
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("pending");
        });

        modelBuilder.Entity<Offer>(entity =>
        {
            entity.HasKey(e => e.OfferId).HasName("PK__Offers__8EBCF0B1BE0333FB");

            entity.Property(e => e.OfferId).HasColumnName("OfferID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Description).HasColumnType("text");
            entity.Property(e => e.DiscountPercentage).HasColumnType("decimal(5, 2)");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.Title)
                .HasMaxLength(200)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(e => e.PaymentId).HasName("PK__Payments__9B556A583F046E97");

            entity.Property(e => e.PaymentId).HasColumnName("PaymentID");
            entity.Property(e => e.Amount).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.PaymentDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.PaymentMethod)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.PaymentStatus)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("pending");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.User).WithMany(p => p.Payments)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Payments__UserID__4D94879B");
        });

        modelBuilder.Entity<Profile>(entity =>
        {
            entity.HasKey(e => e.ProfileId).HasName("PK__Profiles__290C888444EF7FCC");

            entity.HasIndex(e => e.UserId, "UQ__Profiles__1788CCADCFBDEAF7").IsUnique();

            entity.Property(e => e.ProfileId).HasColumnName("ProfileID");
            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.Location)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Phone)
                .HasMaxLength(15)
                .IsUnicode(false);
            entity.Property(e => e.ProfilePicture)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.User).WithOne(p => p.Profile)
                .HasForeignKey<Profile>(d => d.UserId)
                .HasConstraintName("FK__Profiles__UserID__48CFD27E");
        });

        modelBuilder.Entity<Review>(entity =>
        {
            entity.HasKey(e => e.ReviewId).HasName("PK__Reviews__74BC79AE69305001");

            entity.Property(e => e.ReviewId).HasColumnName("ReviewID");
            entity.Property(e => e.Comment).HasColumnType("text");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ServiceId).HasColumnName("ServiceID");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.Service).WithMany(p => p.Reviews)
                .HasForeignKey(d => d.ServiceId)
                .HasConstraintName("FK__Reviews__Service__5EBF139D");

            entity.HasOne(d => d.User).WithMany(p => p.Reviews)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Reviews__UserID__5DCAEF64");
        });

        modelBuilder.Entity<Service>(entity =>
        {
            entity.HasKey(e => e.ServiceId).HasName("PK__Services__C51BB0EA75CCD21D");

            entity.Property(e => e.ServiceId).HasColumnName("ServiceID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Description).HasColumnType("text");
            entity.Property(e => e.Description2).IsUnicode(false);
            entity.Property(e => e.Image)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.Link).IsUnicode(false);
            entity.Property(e => e.Price).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.Question).IsUnicode(false);
            entity.Property(e => e.ServiceName)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
        });

        modelBuilder.Entity<ServiceDetail>(entity =>
        {
            entity.HasKey(e => e.DetailId).HasName("PK__service___135C314D23B59414");

            entity.ToTable("service_details");

            entity.Property(e => e.DetailId).HasColumnName("DetailID");
            entity.Property(e => e.Rating).HasColumnType("decimal(3, 2)");
            entity.Property(e => e.Review).HasColumnType("text");
            entity.Property(e => e.ReviewDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ServiceId).HasColumnName("ServiceID");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.Service).WithMany(p => p.ServiceDetails)
                .HasForeignKey(d => d.ServiceId)
                .HasConstraintName("FK__service_d__Servi__74AE54BC");
        });

        modelBuilder.Entity<ServicesGallery>(entity =>
        {
            entity.HasKey(e => e.GalleryId).HasName("PK__Services__CF4F7BB5DB28B968");

            entity.ToTable("ServicesGallery");

            entity.Property(e => e.Image1)
                .IsUnicode(false)
                .HasColumnName("image1");
            entity.Property(e => e.Image2)
                .IsUnicode(false)
                .HasColumnName("image2");
            entity.Property(e => e.Image3)
                .IsUnicode(false)
                .HasColumnName("image3");
            entity.Property(e => e.Image4)
                .IsUnicode(false)
                .HasColumnName("image4");
            entity.Property(e => e.Image5)
                .IsUnicode(false)
                .HasColumnName("image5");
            entity.Property(e => e.Image6)
                .IsUnicode(false)
                .HasColumnName("image6");
            entity.Property(e => e.ServiceId).HasColumnName("ServiceID");

            entity.HasOne(d => d.Service).WithMany(p => p.ServicesGalleries)
                .HasForeignKey(d => d.ServiceId)
                .HasConstraintName("FK__ServicesG__Servi__7D439ABD");
        });

        modelBuilder.Entity<TourismStatistic>(entity =>
        {
            entity.HasKey(e => new { e.Year, e.Days }).HasName("PK__tourism___3D07CE2BD96A44EE");

            entity.ToTable("tourism_statistics");

            entity.Property(e => e.Year).HasColumnName("year");
            entity.Property(e => e.Days)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("days");
            entity.Property(e => e.Awwards).HasColumnName("awwards");
            entity.Property(e => e.Clients).HasColumnName("clients");
            entity.Property(e => e.ClientsChangePercentage)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("clients_change_percentage");
            entity.Property(e => e.Duration)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("duration");
            entity.Property(e => e.Items).HasColumnName("items");
            entity.Property(e => e.ItemsChangePercentage)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("items_change_percentage");
            entity.Property(e => e.Reservations).HasColumnName("reservations");
            entity.Property(e => e.ReservationsChangePercentage)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("reservations_change_percentage");
            entity.Property(e => e.ReturningClients).HasColumnName("returning_clients");
            entity.Property(e => e.ReturningClientsChangePercentage)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("returning_clients_change_percentage");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CCACD499951F");

            entity.HasIndex(e => e.Username, "UQ__Users__536C85E4A1264E2B").IsUnique();

            entity.HasIndex(e => e.Email, "UQ__Users__A9D10534D9894E5E").IsUnique();

            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.FirstName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.LastName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.Phone)
                .HasMaxLength(13)
                .IsUnicode(false);
            entity.Property(e => e.ProfileImage).IsUnicode(false);
            entity.Property(e => e.UserRole)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("user");
            entity.Property(e => e.Username)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
