using Application.Features.AccountFeatures.Dtos;
using Application.Features.CollectionFeatures.Dtos;

namespace Application.Features.TokenFeatures.Dtos;

public class TokenDto
{
    public Guid Id { get; set; }

    public string Name { get; set; }
    public string Image { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }

    public CollectionDto Collection { get; set; }

    public UserDto Author { get; set; }
}
