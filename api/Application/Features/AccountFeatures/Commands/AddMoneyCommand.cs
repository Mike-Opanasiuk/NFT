using Application.Features.AccountFeatures.Dtos;
using Application.Features.AccountFeatures.Services;
using AutoMapper;
using Core.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Shared.CommonExceptions;
using Shared;
using Infrastructure.UnitOfWork.Abstract;

namespace Application.Features.AccountFeatures.Commands;

public record AddMoneyCommand(Guid UserId, decimal Count) : IRequest;

public class AddMoneyHandler : IRequestHandler<AddMoneyCommand>
{
    private readonly UserManager<UserEntity> userManager;

    public AddMoneyHandler(UserManager<UserEntity> userManager)
    {
        this.userManager = userManager;
    }

    public async Task Handle(AddMoneyCommand request, CancellationToken cancellationToken)
    {
        var user = await userManager.FindByIdAsync(request.UserId.ToString());

        if(user == null)
        {
            throw new BadRequestRestException("User does not exist");
        }

        user.MoneyAvailable += request.Count;

        await userManager.UpdateAsync(user);
    }
}