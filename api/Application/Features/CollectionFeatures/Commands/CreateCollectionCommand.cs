using AutoMapper;
using Core.Entities;
using Infrastructure.UnitOfWork.Abstract;
using MediatR;
using Shared.CommonExceptions;
using Shared.Services;
using Shared.Services.FileStorageService.Abstract;

namespace Application.Features.CollectionFeatures.Commands;

public record CreateCollectionRequest
{
    public string Name { get; set; }
    public string Image { get; set; }
    public string ImageName { get; set; }
}

public record CreateCollectionCommand : CreateCollectionRequest, IRequest
{
    public Guid AuthorId { get; set; }
}

public class CreateCollectionHandler : IRequestHandler<CreateCollectionCommand>
{
    private readonly IUnitOfWork unitOfWork;
    private readonly IMapper mapper;
    private readonly IFileStorageService fileStorageService;

    public CreateCollectionHandler(IMapper mapper, IUnitOfWork unitOfWork, IFileStorageService fileStorageService)
    {
        this.mapper = mapper;
        this.unitOfWork = unitOfWork;
        this.fileStorageService = fileStorageService;
    }

    public async Task Handle(CreateCollectionCommand request, CancellationToken cancellationToken)
    {
        var collectionEntity = mapper.Map<CollectionEntity>(request);

        if (!string.IsNullOrEmpty(request.Image))
        {
            if (!AppService.IsStringHasBase64Format(request.Image))
            {
                throw new BadRequestRestException("Input image string was not in base64 format");
            }

            var actualImagePath = fileStorageService.SaveCollectionImage(request.Image, request.ImageName, Guid.NewGuid());
            collectionEntity.Image = actualImagePath;
        }

        await unitOfWork.Collections.InsertAsync(collectionEntity);
        await unitOfWork.SaveChangesAsync();
    }
}