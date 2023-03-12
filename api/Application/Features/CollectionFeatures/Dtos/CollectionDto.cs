using Application.Features.AccountFeatures.Dtos;
using Application.Features.TokenFeatures.Dtos;

namespace Application.Features.CollectionFeatures.Dtos;

public class CollectionDto
{
    public Guid Id { get; set; }

    public string Name { get; set; }
    public string Image { get; set; }
    public UserDto Author { get; set; }

    public ICollection<TokenDto> Tokens { get; set; } = new HashSet<TokenDto>();
}
