using Application.Features.CollectionFeatures.Dtos;
using AutoMapper;
using Infrastructure.UnitOfWork.Abstract;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.CollectionFeatures.Queries;

public record GetMostPopularCollectionsQuery(int Count) : IRequest<IEnumerable<CollectionDto>>;

public class GetMostPopularCollectionsHandler : IRequestHandler<GetMostPopularCollectionsQuery, IEnumerable<CollectionDto>>
{
    private readonly IUnitOfWork unitOfWork;
    private readonly IMapper mapper;

    public GetMostPopularCollectionsHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        this.unitOfWork = unitOfWork;
        this.mapper = mapper;
    }

    public Task<IEnumerable<CollectionDto>> Handle(GetMostPopularCollectionsQuery request, CancellationToken cancellationToken)
    {
        var collections = unitOfWork.Collections
            .Get()
            .Include(c => c.Author)
            .Where(c => c.Image != null)
            .AsQueryable()
            .Take(request.Count);

        return Task.FromResult(mapper.Map<IEnumerable<CollectionDto>>(collections));
    }
}

