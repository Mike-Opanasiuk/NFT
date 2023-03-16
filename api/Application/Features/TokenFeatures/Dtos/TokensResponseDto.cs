
namespace Application.Features.TokenFeatures.Dtos;

public record TokensResponseDto
{
    public ICollection<TokenDto> Tokens { get; set; } = new HashSet<TokenDto>();
    public int TotalPages { get; set; }
    public decimal MinPrice { get; set; }
    public decimal MaxPrice { get; set; }
}