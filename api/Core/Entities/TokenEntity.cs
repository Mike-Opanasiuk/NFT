using Core.Entities.Abstract;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.Entities;

[Table("Tokens")]
public class TokenEntity : BaseEntity
{
    // properties

    public string Name { get; set; }
    public string Image { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }

    // foreign keys
    public Guid AuthorId { get; set; }
    public Guid CurrentOwnerId { get; set; }
    public Guid CollectionId { get; set; }

    // navigation properties

    /* collection to which this token belongs to */
    public CollectionEntity Collection { get; set; }

    /* author of this token */
    public UserEntity Author { get; set; }

    /* user who bought and owns this token */
    public UserEntity CurrentOwner { get; set; }
}
