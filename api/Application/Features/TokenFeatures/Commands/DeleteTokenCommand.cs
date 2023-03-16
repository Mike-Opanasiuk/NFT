using Infrastructure.UnitOfWork.Abstract;
using MediatR;
using Shared.CommonExceptions;
using Shared.Services.FileStorageService.Abstract;

namespace Application.Features.TokenFeatures.Commands;

public class DeleteTokenRequest
{
    public Guid TokenId { get; set; }
}

public class DeleteTokenCommand : DeleteTokenRequest, IRequest
{
    public Guid UserId { get; set; }
    public bool IsAdmin { get; set; }
}

public class DeleteTokenHandler : IRequestHandler<DeleteTokenCommand>
{
    private readonly IUnitOfWork unitOfWork;
    private readonly IFileStorageService fileStorageService;

    public DeleteTokenHandler(IUnitOfWork unitOfWork, IFileStorageService fileStorageService)
    {
        this.unitOfWork = unitOfWork;
        this.fileStorageService = fileStorageService;
    }

    public async Task Handle(DeleteTokenCommand request, CancellationToken cancellationToken)
    {
        var tokenId = request.TokenId;
        var token = unitOfWork.Tokens
            .Get()
            .FirstOrDefault(t => t.Id == tokenId);

        if (token == null)
        {
            throw new BadRequestRestException($"Token with id {tokenId} wasn`t found");
        }

        if (request.UserId != token.AuthorId && !request.IsAdmin)
        {
            throw new BadRequestRestException($"Only owner can delete token");
        }

        if (!string.IsNullOrEmpty(token.Image))
        {
            fileStorageService.DeleteFile(token.Image);
        }

        unitOfWork.Tokens.Delete(token);
        await unitOfWork.SaveChangesAsync();
    }
}
