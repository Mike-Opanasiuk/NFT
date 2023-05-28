using Application.Features.CollectionFeatures.Dtos;
using Application.Features.CollectionFeatures.Queries;
using Application.Features.TokenFeatures.Commands;
using Application.Features.TokenFeatures.Dtos;
using Application.Features.TokenFeatures.Queries;
using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Web.Controllers.Abstract;
using Web.Extension;

namespace Web.Controllers;

[Authorize]
public class TokensController : BaseController
{
    private readonly IMediator mediator;
    private readonly IMapper mapper;

    public TokensController(IMediator mediator, IMapper mapper)
    {
        this.mediator = mediator;
        this.mapper = mapper;
    }

    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<TokensResponseDto>> GetTokensAsync([FromQuery] GetTokensQuery request)
    {
        return await mediator.Send(request);
    }

    [AllowAnonymous]
    [HttpGet("{tokenId}")]
    public async Task<ActionResult<TokenDto>> GetTokenByIdAsync([FromRoute] Guid tokenId)
    {
        return await mediator.Send(new GetTokenByIdQuery() { Id = tokenId });
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateTokenAsync([FromBody] CreateTokenRequest request)
    {
        var userId = HttpContext.GetCurrentUserGuid();
        var command = mapper.Map<CreateTokenCommand>(request);
        command.AuthorId = userId;

        await mediator.Send(command);

        return StatusCode(StatusCodes.Status201Created);
    }

    [HttpPut("update")]
    public async Task<IActionResult> UpdateTokenAsync([FromBody] UpdateTokenRequest request)
    {
        var command = mapper.Map<UpdateTokenCommand>(request);
        var userId = HttpContext.GetCurrentUserGuid();

        command.UserId = userId;

        await mediator.Send(command);

        return StatusCode(StatusCodes.Status200OK);
    }

    [HttpDelete("delete")]
    public async Task<IActionResult> DeleteTokenAsync([FromQuery] DeleteTokenRequest request)
    {
        var command = mapper.Map<DeleteTokenCommand>(request);

        command.IsAdmin = HttpContext.IsCurrentUserAdmin();
        command.UserId = HttpContext.GetCurrentUserGuid();

        await mediator.Send(command);

        return StatusCode(StatusCodes.Status200OK);
    }
}
