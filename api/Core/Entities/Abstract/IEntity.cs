namespace Core.Entities.Abstract;

public interface IEntity
{
    // unique key
    Guid Id { get; set; }

    // properties
    DateTime CreatedAt { get; set; }
    DateTime UpdatedAt { get; set; }
}