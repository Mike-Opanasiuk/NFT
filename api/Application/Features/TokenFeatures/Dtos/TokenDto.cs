using Application.Features.AccountFeatures.Dtos;
using Application.Features.CollectionFeatures.Dtos;

namespace Application.Features.TokenFeatures.Dtos;

public class TokenDto
{
    public string Name { get; set; }
    public string Picture { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public string Currency { get; set; }

    public CollectionDto Collection { get; set; }

    public UserDto Author { get; set; }
}
