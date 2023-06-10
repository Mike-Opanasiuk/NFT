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

    [HttpGet("most-popular/{count}")]
    public async Task<ActionResult<IEnumerable<CollectionDto>>> GetMostPopularCollections([FromRoute] int count)
    {
        return Ok(await mediator.Send(new GetMostPopularCollectionsQuery(count)));
    }

    [HttpGet("{collectionId}")]
    public async Task<ActionResult<CollectionDto>> GetCollectionsAsync([FromRoute] Guid collectionId)
    {
        return await mediator.Send(new GetCollectionByIdQuery() { Id = collectionId });
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

    [Authorize]
    [HttpPut("update")]
    public async Task<IActionResult> UpdateCollectionAsync([FromBody] UpdateCollectionRequest request)
    {
        var command = mapper.Map<UpdateCollectionCommand>(request);
        var userId = HttpContext.GetCurrentUserGuid();

        command.UserId = userId;

        await mediator.Send(command);

        return StatusCode((int)HttpStatusCode.OK);
    }

    [Authorize]
    [HttpDelete("delete")]
    public async Task<IActionResult> DeleteCollectionAsync([FromQuery] DeleteCollectionRequest request)
    {
        var command = mapper.Map<DeleteCollectionCommand>(request);

        command.IsAdmin = HttpContext.IsCurrentUserAdmin();
        command.UserId = HttpContext.GetCurrentUserGuid();

        await mediator.Send(command);

        return StatusCode((int)HttpStatusCode.OK);
    }
}
