using AutoMapper;
using Core.Entities;
using Infrastructure.UnitOfWork.Abstract;
using MediatR;
using Shared.CommonExceptions;
using Shared.Services;
using Shared.Services.FileStorageService.Abstract;

namespace Application.Features.TokenFeatures.Commands;

public record CreateTokenRequest
{
    public string Name { get; set; }
    public string Image { get; set; }
    public string ImageName { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }

    public Guid CollectionId { get; set; }
}

public record CreateTokenCommand : CreateTokenRequest, IRequest
{
    public Guid AuthorId { get; set; }
}

public class CreateTokenHandler : IRequestHandler<CreateTokenCommand>
{
    private readonly IUnitOfWork unitOfWork;
    private readonly IMapper mapper;
    private readonly IFileStorageService fileStorageService;

    public CreateTokenHandler(IMapper mapper, IUnitOfWork unitOfWork, IFileStorageService fileStorageService)
    {
        this.mapper = mapper;
        this.unitOfWork = unitOfWork;
        this.fileStorageService = fileStorageService;
    }

    public async Task Handle(CreateTokenCommand request, CancellationToken cancellationToken)
    {
        var tokenEntity = mapper.Map<TokenEntity>(request);
        tokenEntity.CurrentOwnerId = request.AuthorId;

        if (!string.IsNullOrEmpty(request.Image))
        {
            if (!AppService.IsStringHasBase64Format(request.Image))
            {
                throw new BadRequestRestException("Input image string was not in base64 format");
            }

            var actualImagePath = fileStorageService.SaveTokenImage(request.Image, request.ImageName, Guid.NewGuid());
            tokenEntity.Image = actualImagePath;
        }

        await unitOfWork.Tokens.InsertAsync(tokenEntity);
        await unitOfWork.SaveChangesAsync();
    }
}