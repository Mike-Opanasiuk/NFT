using Application.Features.CollectionFeatures.Commands;
using Application.Features.CollectionFeatures.Dtos;
using Application.Features.CollectionFeatures.Queries;
using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using Web.Controllers.Abstract;
using Web.Extension;

namespace Web.Controllers;

public class CollectionsController : BaseController
{
    private readonly IMediator mediator;
    private readonly IMapper mapper;

    public CollectionsController(IMediator mediator, IMapper mapper)
    {
        this.mediator = mediator;
        this.mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<CollectionsResponseDto>> GetCollectionsAsync([FromQuery] GetCollectionsQuery request)
    {
        return await mediator.Send(request);
    }


    [Authorize]
    [HttpPost("create")]
    public async Task<IActionResult> CreateCollectionAsync([FromBody] CreateCollectionRequest request)
    {
        var userId = HttpContext.GetCurrentUserGuid();

        var command = mapper.Map<CreateCollectionCommand>(request);
        command.AuthorId = userId;

        await mediator.Send(command);

        return StatusCode((int)HttpStatusCode.Created);
    }
}
