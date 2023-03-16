using Application.Features.CollectionFeatures.Dtos;
using AutoMapper;
using Core.Entities;
using Infrastructure.UnitOfWork.Abstract;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Shared.Services;
using static Shared.AppConstant;

namespace Application.Features.CollectionFeatures.Queries;

public record GetCollectionsQuery : IRequest<CollectionsResponseDto>
{
    public int Page { get; set; }
    public int PerPage { get; set; }
    public string SearchString { get; set; }
    public string OrderBy { get; set; }
    public string Order { get; set; }
}

public class GetCollectionsHandler : IRequestHandler<GetCollectionsQuery, CollectionsResponseDto>
{
    private readonly IUnitOfWork unitOfWork;
    private readonly IMapper mapper;

    public GetCollectionsHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        this.unitOfWork = unitOfWork;
        this.mapper = mapper;
    }

    public Task<CollectionsResponseDto> Handle(GetCollectionsQuery request, CancellationToken cancellationToken)
    {
        var collections = unitOfWork.Collections.Get()
            .Include(c => c.Tokens)
            .Include(c => c.Author)
            .AsQueryable();

        if(!string.IsNullOrEmpty(request.SearchString))
        {
            collections = collections.Where(c => c.Name.Contains(request.SearchString));
        }

        collections = SortCollections(collections, request.OrderBy, request.Order);

        collections = AppService.Paginate(
            collections, 
            request.PerPage == default ? General.DefaultPerPage : request.PerPage, 
            request.Page == default ? General.DefaultPage : request.Page, 
            out int totalPages);

        return Task.FromResult(new CollectionsResponseDto()
        { 
            TotalPages = totalPages,
            Collections = mapper.Map<ICollection<CollectionDto>>(collections)
        });
    }

    private static IQueryable<CollectionEntity> SortCollections(IQueryable<CollectionEntity> collections, string orderBy, string order)
    {
        switch (orderBy)
        {
            case SortOrder.By.Name:
                switch (order)
                {
                    case SortOrder.Asc:
                        return collections.OrderBy(p => p.Name);
                    case SortOrder.Desc:
                        return collections.OrderByDescending(p => p.Name);
                }
                break;
            case SortOrder.By.Date:
                switch (order)
                {
                    case SortOrder.Asc:
                        return collections.OrderBy(p => p.CreatedAt);
                    case SortOrder.Desc:
                        return collections.OrderByDescending(p => p.CreatedAt);
                }
                break;
        }
        return collections;
    }
}