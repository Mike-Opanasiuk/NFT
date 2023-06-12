using AutoMapper;
using Infrastructure.UnitOfWork.Abstract;
using MediatR;
using Shared.CommonExceptions;
using Shared.Services;
using Shared.Services.FileStorageService.Abstract;

namespace Application.Features.TokenFeatures.Commands;

public class UpdateTokenRequest
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Image { get; set; }
    public string ImageName { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }

    public Guid CollectionId { get; set; }
}

public class UpdateTokenCommand : UpdateTokenRequest, IRequest
{
    public Guid UserId { get; set; }
}


public class UpdateTokenHandler : IRequestHandler<UpdateTokenCommand>
{
    private readonly IUnitOfWork unitOfWork;
    private readonly IMapper mapper;
    private readonly IFileStorageService fileStorageService;

    public UpdateTokenHandler(IUnitOfWork unitOfWork, IMapper mapper, IFileStorageService fileStorageService)
    {
        this.unitOfWork = unitOfWork;
        this.mapper = mapper;
        this.fileStorageService = fileStorageService;
    }

    public async Task Handle(UpdateTokenCommand request, CancellationToken cancellationToken)
    {
        var tokenId = request.Id;
        var token = unitOfWork.Tokens
            .Get()
            .FirstOrDefault(c => c.Id == tokenId);

        if (token == null)
        {
            throw new BadRequestRestException($"Token with id {tokenId} wasn`t found");
        }

        if (request.UserId != token.AuthorId)
        {
            throw new BadRequestRestException($"Only owner can update token");
        }

        if (token.Image != request.ImageName // if image name is different it means that image was changed
            && !string.IsNullOrEmpty(request.Image)) // if new image is not empty
        {
            if (!AppService.IsStringHasBase64Format(request.Image))
            {
                throw new BadRequestRestException("Input image string was not in base64 format");
            }

            fileStorageService.DeleteFile(token.Image); // delete old image

            // save new image
            var actualImagePath = fileStorageService.SaveTokenImage(request.Image, request.ImageName, Guid.NewGuid());
            token.Image = actualImagePath;
        }

        token.Name = request.Name;
        token.Description = request.Description;
        token.Price = request.Price;
        token.CollectionId = request.CollectionId;

        unitOfWork.Tokens.Update(token);
        await unitOfWork.SaveChangesAsync();
    }
}