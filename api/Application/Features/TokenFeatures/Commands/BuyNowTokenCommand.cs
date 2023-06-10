using Core.Entities;
using Infrastructure.UnitOfWork.Abstract;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Shared.CommonExceptions;
using Shared.Services.FileStorageService.Abstract;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Features.TokenFeatures.Commands;

public record BuyNowTokenCommand : IRequest
{
    public Guid CurrentUserId { get; set; }
    public Guid TokenId { get; set; }
}

public class BuyNowTokenCommandHandler : IRequestHandler<BuyNowTokenCommand>
{
    private readonly IUnitOfWork unitOfWork;
    private readonly UserManager<UserEntity> userManager;

    public BuyNowTokenCommandHandler(IUnitOfWork unitOfWork, UserManager<UserEntity> userManager)
    {
        this.unitOfWork = unitOfWork;
        this.userManager = userManager;
    }

    public async Task Handle(BuyNowTokenCommand request, CancellationToken cancellationToken)
    {
        var buyerId = request.CurrentUserId;
        var tokenId = request.TokenId;

        if (buyerId == Guid.Empty)
        {
            throw new BadRequestRestException("Buyer does not exist.");
        }

        var buyer = await userManager.FindByIdAsync(request.CurrentUserId.ToString());

        if (buyer == null)
        {
            throw new BadRequestRestException("Buyer not found.");
        }

        var token = await unitOfWork.Tokens.FindAsync(tokenId);

        if (buyerId == token.AuthorId)
        {
            throw new BadRequestRestException("You cannot buy own token.");
        }

        if (token == null)
        {
            throw new BadRequestRestException("Token not found.");
        }

        if (buyer.MoneyAvailable < token.Price)
        {
            throw new BadRequestRestException("You don`t have enough money to buy token.");
        }

        buyer.MoneyAvailable -= token.Price;
        token.CurrentOwnerId = buyerId;

        await unitOfWork.SaveChangesAsync();
    }
}
