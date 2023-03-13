namespace Application.Features.CollectionFeatures.Dtos;

public record CollectionsResponseDto
{
    public ICollection<CollectionDto> Collections { get; set; } = new HashSet<CollectionDto>();
    public int TotalPages { get; set; }
}