namespace Application.Features.AccountFeatures.Dtos;

public record UserDto
{
    public Guid Id { get; set; }
    public string UserName { get; set; }
    public string Image { get; set; }
    public decimal MoneyAvailable { get; set; }
}
