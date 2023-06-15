using Core.Entities.Abstract;
using Microsoft.AspNetCore.Identity;

namespace Core.Entities;

public class UserEntity : IdentityUser<Guid>, IEntity
{
    // properties

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string Image { get; set; }
    public decimal MoneyAvailable { get; set; }
    public string Name { get; set; }
    public string Surname { get; set; }
    public string MobilePhone { get; set; }
    public string Country { get; set; }
    public string Region { get; set; }

    // navigation properties

    /* tokens created by this user */
    public ICollection<TokenEntity> Tokens { get; set; } = new HashSet<TokenEntity>();

    /* collections created by this user */
    public ICollection<CollectionEntity> Collections { get; set; } = new HashSet<CollectionEntity>();

    /* tokens bought by this user */
    public ICollection<TokenEntity> OwnedTokens { get; set; } = new HashSet<TokenEntity> { };
}