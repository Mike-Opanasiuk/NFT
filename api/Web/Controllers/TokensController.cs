using Application.Features.TokenFeatures.Commands;
using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Web.Controllers.Abstract;
using Web.Extension;

namespace Web.Controllers;

public class TokensController : BaseController
{
    private readonly IMediator mediator;
    private readonly IMapper mapper;

    public TokensController(IMediator mediator, IMapper mapper)
    {
        this.mediator = mediator;
        this.mapper = mapper;
    }

    [Authorize]
    [HttpPost("create")]
    public async Task<IActionResult> CreateTokenAsync([FromBody] CreateTokenRequest request)
    {
        var userId = HttpContext.GetCurrentUserGuid();
        var command = mapper.Map<CreateTokenCommand>(request);
        command.AuthorId = userId;

        await mediator.Send(command);

        return StatusCode(StatusCodes.Status201Created);
    }
}
