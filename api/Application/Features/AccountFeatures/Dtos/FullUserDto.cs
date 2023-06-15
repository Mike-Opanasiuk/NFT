namespace Application.Features.AccountFeatures.Dtos;

public record FullUserDto : UserDto
{
    public string Name { get; set; }
    public string Surname { get; set; }
    public string MobilePhone { get; set; }
    public string Country { get; set; }
    public string Region { get; set; }
}
