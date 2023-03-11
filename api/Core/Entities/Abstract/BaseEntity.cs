namespace Core.Entities.Abstract;

public abstract class BaseEntity : IEntity
{
    // unique key
    public Guid Id { get; set; }

    // properties
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}