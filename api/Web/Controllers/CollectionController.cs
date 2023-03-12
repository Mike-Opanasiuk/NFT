using Application.Features.CollectionFeatures.Commands;
using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using Web.Controllers.Abstract;
using Web.Extension;

namespace Web.Controllers;

public class CollectionController : BaseController
{
    private readonly IMediator mediator;
    private readonly IMapper mapper;

    public CollectionController(IMediator mediator, IMapper mapper)
    {
        this.mediator = mediator;
        this.mapper = mapper;
    }

    [Authorize]
    [HttpPost("create")]
    public async Task<IActionResult> CreateCollectionAsync(CreateCollectionRequest request)
    {
        var userId = HttpContext.GetCurrentUserGuid();

        var command = mapper.Map<CreateCollectionCommand>(request);
        command.AuthorId = userId;

        await mediator.Send(command);

        return StatusCode((int)HttpStatusCode.Created);
    }
}
