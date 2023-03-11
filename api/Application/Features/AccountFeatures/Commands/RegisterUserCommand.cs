using Application.Features.AccountFeatures.Dtos;
using Application.Features.AccountFeatures.Services;
using AutoMapper;
using Core.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Shared;
using Shared.CommonExceptions;

namespace Application.Features.AccountFeatures.Commands;

public record RegisterUserCommand(string UserName, string Password) : IRequest<AuthResponse>;

public class RegisterUserHandler : IRequestHandler<RegisterUserCommand, AuthResponse>
{
    private readonly UserManager<UserEntity> userManager;
    private readonly JwtService jwtService;
    private readonly IMapper mapper;

    public RegisterUserHandler(UserManager<UserEntity> userManager, JwtService jwtService, IMapper mapper)
    {
        this.userManager = userManager;
        this.jwtService = jwtService;
        this.mapper = mapper;
    }

    public async Task<AuthResponse> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
    {
        var user = mapper.Map<UserEntity>(request);

        var result = await userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            throw new BadRequestRestException("Invalid credentials", result.Errors);
        }

        await userManager.AddToRoleAsync(user, AppConstant.Roles.User);

        var token = jwtService.GenerateToken(
            user.Id.ToString(),
            string.Join(", ", await userManager.GetRolesAsync(user)),
            AppConstant.JwtTokenLifetimes.Default);

        return new AuthResponse()
        {
            Token = token,
            User = mapper.Map<UserDto>(user)
        };
    }
}