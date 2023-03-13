using Application.Features.AccountFeatures.Commands;
using Application.Features.AccountFeatures.Dtos;
using Application.Features.AccountFeatures.Queries;
using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Web.Controllers.Abstract;
using Web.Extension;

namespace Web.Controllers;

public class AccountController : BaseController
{
    private readonly IMediator mediator;

    public AccountController(IMediator mediator)
    {
        this.mediator = mediator;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> RegisterAsync([FromBody] RegisterUserCommand command)
    {
        return await mediator.Send(command);
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> LoginAsync([FromBody] LoginUserCommand command)
    {
        return await mediator.Send(command);
    }

    [Authorize]
    [HttpGet("profile")]
    public async Task<ActionResult<UserDto>> GetUserAsync()
    {
        var userId = HttpContext.GetCurrentUserId();

        return Ok(await mediator.Send(new GetUserQuery(userId)));
    }
}
