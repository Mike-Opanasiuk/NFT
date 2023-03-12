using Core.Entities.Abstract;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.Entities;

[Table("Collections")]
public class CollectionEntity : BaseEntity
{
    // properties

    public string Name { get; set; }
    public string Image { get; set; }

    // foreign keys
    public Guid AuthorId { get; set; }

    // navigation properties

    /* author of this collection */
    public UserEntity Author { get; set; }

    /* tokens which belongs to this collection */
    public ICollection<TokenEntity> Tokens { get; set; } = new HashSet<TokenEntity>();
}
