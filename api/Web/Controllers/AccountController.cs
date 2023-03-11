using Application.Features.AccountFeatures.Commands;
using Application.Features.AccountFeatures.Dtos;
using Application.Features.AccountFeatures.Queries;
using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Web.Controllers.Abstract;

namespace Web.Controllers;

public class AccountController : BaseController
{
    private readonly IMapper mapper;
    private readonly IMediator mediator;

    public AccountController(IMediator mediator, IMapper mapper)
    {
        this.mediator = mediator;
        this.mapper = mapper;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterUserCommand command)
    {
        return await mediator.Send(command);
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginUserCommand command)
    {
        return await mediator.Send(command);
    }

    [Authorize]
    [HttpGet("profile")]
    public async Task<ActionResult<UserDto>> GetUserAsync()
    {
        var userId = User.Claims.FirstOrDefault(c => c.Type == "id")?.Value;

        return Ok(await mediator.Send(new GetUserQuery(userId!)));
    }
}
