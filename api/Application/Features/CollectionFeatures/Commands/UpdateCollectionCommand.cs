using AutoMapper;
using Core.Entities;
using Infrastructure.UnitOfWork.Abstract;
using MediatR;
using Shared.CommonExceptions;
using Shared.Services;
using Shared.Services.FileStorageService.Abstract;

namespace Application.Features.CollectionFeatures.Commands;

public class UpdateCollectionRequest
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Image { get; set; }
    public string ImageName { get; set; }
}

public class UpdateCollectionCommand : UpdateCollectionRequest, IRequest
{
    public Guid UserId { get; set; }
}

public class UpdateCollectionHandler : IRequestHandler<UpdateCollectionCommand>
{
    private readonly IUnitOfWork unitOfWork;
    private readonly IMapper mapper;
    private readonly IFileStorageService fileStorageService;

    public UpdateCollectionHandler(IUnitOfWork unitOfWork, IMapper mapper, IFileStorageService fileStorageService)
    {
        this.unitOfWork = unitOfWork;
        this.mapper = mapper;
        this.fileStorageService = fileStorageService;
    }

    public async Task Handle(UpdateCollectionCommand request, CancellationToken cancellationToken)
    {
        var collectionId = request.Id;
        var collection = unitOfWork.Collections
            .Get()
            .FirstOrDefault(c => c.Id == collectionId);

        if (collection == null)
        {
            throw new BadRequestRestException($"Collection with id {collectionId} wasn`t found");
        }

        if (request.UserId != collection.AuthorId)
        {
            throw new BadRequestRestException($"Only owner can update collection");
        }

        if(collection.Image != request.ImageName // if image name is different it means that image was changed
            && !string.IsNullOrEmpty(request.Image)) // if new image is not empty
        {
            if (!AppService.IsStringHasBase64Format(request.Image))
            {
                throw new BadRequestRestException("Input image string was not in base64 format");
            }

            fileStorageService.DeleteFile(collection.Image); // delete old image

            // save new image
            var actualImagePath = fileStorageService.SaveCollectionImage(request.Image, request.ImageName, Guid.NewGuid());
            collection.Image = actualImagePath;
        }

        collection.Name = request.Name;

        unitOfWork.Collections.Update(collection);
        await unitOfWork.SaveChangesAsync();
    }
}