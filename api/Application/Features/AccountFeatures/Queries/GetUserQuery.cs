using Application.Features.AccountFeatures.Dtos;
using AutoMapper;
using Core.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.Features.AccountFeatures.Queries;

public record GetUserQuery(string Id) : IRequest<UserDto>;

public class GetUserHandler : IRequestHandler<GetUserQuery, UserDto>
{
    private readonly UserManager<UserEntity> _userManager;
    private readonly IMapper _mapper;

    public GetUserHandler(UserManager<UserEntity> userManager, IMapper mapper)
    {
        _userManager = userManager;
        _mapper = mapper;
    }

    public async Task<UserDto> Handle(GetUserQuery request, CancellationToken cancellationToken)
    {
        var userEntity = await _userManager.FindByIdAsync(request.Id);

        return _mapper.Map<UserDto>(userEntity);
    }
}
