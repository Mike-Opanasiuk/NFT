
using Infrastructure.UnitOfWork.Abstract;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Shared.CommonExceptions;
using Shared.Services.FileStorageService.Abstract;

namespace Application.Features.CollectionFeatures.Commands;

public class DeleteCollectionRequest
{
    public Guid CollectionId { get; set; }
}

public class DeleteCollectionCommand : DeleteCollectionRequest, IRequest
{
    public Guid AuthorId { get; set; }
    public bool IsAdmin { get; set; }
}

public class DeleteCollectionHandler : IRequestHandler<DeleteCollectionCommand>
{
    private readonly IUnitOfWork unitOfWork;
    private readonly IFileStorageService fileStorageService;
    
    public DeleteCollectionHandler(IUnitOfWork unitOfWork, IFileStorageService fileStorageService)
    {
        this.unitOfWork = unitOfWork;
        this.fileStorageService = fileStorageService;
    }

    public async Task Handle(DeleteCollectionCommand request, CancellationToken cancellationToken)
    {
        var collectionId = request.CollectionId;
        var collection = unitOfWork.Collections
            .Get()
            .Include(c => c.Tokens)
            .FirstOrDefault(c => c.Id == collectionId);

        if (collection == null)
        {
            throw new BadRequestRestException($"Collection with id {collectionId} wasn`t found");
        }

        if(collection.AuthorId != request.AuthorId && !request.IsAdmin)
        {
            throw new BadRequestRestException($"Only owner can delete collection");
        }

        if(collection.Tokens.Any())
        {
            throw new BadRequestRestException("Collection cannot be deleted because it contains tokens");
        }

        if (!string.IsNullOrEmpty(collection.Image))
        {
            fileStorageService.DeleteFile(collection.Image);
        }

        unitOfWork.Collections.Delete(collection);
        await unitOfWork.SaveChangesAsync();
    }
}
