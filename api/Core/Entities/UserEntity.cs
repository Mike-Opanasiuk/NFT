using Core.Entities.Abstract;
using Microsoft.AspNetCore.Identity;

namespace Core.Entities;

public class UserEntity : IdentityUser<Guid>, IEntity
{
    // properties

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string Image { get; set; }

    // navigation properties

    /* tokens created by this user */
    public ICollection<TokenEntity> Tokens { get; set; } = new HashSet<TokenEntity>();

    /* collections created by this user */
    public ICollection<CollectionEntity> Collections { get; set; } = new HashSet<CollectionEntity>();
}