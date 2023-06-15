using Application.Features.AccountFeatures.Commands;
using Application.Features.AccountFeatures.Dtos;
using Application.Features.AccountFeatures.Queries;
using Application.Features.CollectionFeatures.Dtos;
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
    private readonly IMapper mapper;

    public AccountController(IMediator mediator, IMapper mapper)
    {
        this.mediator = mediator;
        this.mapper = mapper;
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
    [HttpPost("replenish/{count}")]
    public async Task<IActionResult> ReplenishMoneyAsync([FromRoute] decimal count)
    {
        var userId = HttpContext.GetCurrentUserGuid();
        await mediator.Send(new AddMoneyCommand(userId, count));

        return Ok();
    }

    [Authorize]
    [HttpPut("update")]
    public async Task<IActionResult> UpdateUserAsync([FromBody] UpdateUserRequest request)
    {
        var userId = HttpContext.GetCurrentUserGuid();

        var command = mapper.Map<UpdateUserCommand>(request);
        command.UserId = userId;

        await mediator.Send(command);

        return Ok();
    }

    [Authorize]
    [HttpGet("profile")]
    public async Task<ActionResult<FullUserDto>> GetUserAsync()
    {
        var userId = HttpContext.GetCurrentUserId();

        return Ok(await mediator.Send(new GetUserQuery(userId)));
    }

    [HttpGet("{userId}/collections")]
    public async Task<ActionResult<IEnumerable<CollectionDto>>> GetUserCollectionsAsync([FromRoute] Guid userId)
    {
        return Ok(await mediator.Send(new GetUserCollectionsQuery(userId)));
    }

    [HttpGet("{userId}/tokens")]
    public async Task<ActionResult<IEnumerable<CollectionDto>>> GetUserTokensAsync([FromRoute] Guid userId)
    {
        return Ok(await mediator.Send(new GetUserTokensQuery(userId)));
    }
}
