using Core.Entities.Abstract;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.Entities;

[Table("Tokens")]
public class TokenEntity : BaseEntity
{
    // properties

    public string Name { get; set; }
    public string Picture { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public string Currency { get; set; }

    // navigation properties

    /* collection to which this token belongs to */
    public CollectionEntity Collection { get; set; }

    /* author of this token */
    public UserEntity Author { get; set; }
}
