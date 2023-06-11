
using Application.Features.TokenFeatures.Dtos;
using AutoMapper;
using Core.Entities;
using Infrastructure.UnitOfWork.Abstract;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Shared.Services;
using static Shared.AppConstant;

namespace Application.Features.TokenFeatures.Queries;

public record GetTokensQuery : IRequest<TokensResponseDto>
{
    public int Page { get; set; }
    public int PerPage { get; set; }
    public string SearchString { get; set; }
    public string OrderBy { get; set; }
    public string Order { get; set; }
    public decimal MinPrice { get; set; }
    public decimal MaxPrice { get; set; }
    public Guid CollectionId { get; set; }
}

public class GetTokensHandler : IRequestHandler<GetTokensQuery, TokensResponseDto>
{
    private readonly IUnitOfWork unitOfWork;
    private readonly IMapper mapper;

    public GetTokensHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        this.unitOfWork = unitOfWork;
        this.mapper = mapper;
    }

    public Task<TokensResponseDto> Handle(GetTokensQuery request, CancellationToken cancellationToken)
    {
        var tokens = unitOfWork.Tokens
            .Get()
            .Include(t => t.Author)
            .Include(t => t.CurrentOwner)
            .Include(t => t.Collection)
            .AsQueryable();

        if(request.CollectionId != Guid.Empty)
        {
            tokens = tokens.Where(t => t.CollectionId == request.CollectionId);
        }

        if(!string.IsNullOrEmpty(request.SearchString))
        {
            tokens = tokens.Where(t => t.Name.ToLower().Contains(request.SearchString.ToLower()));
        }

        if(request.MinPrice != default)
        {
            tokens = tokens.Where(t => t.Price >= request.MinPrice);
        }

        if (request.MaxPrice != default)
        {
            tokens = tokens.Where(t => t.Price <= request.MaxPrice);
        }

        if(!tokens.Any())
        {
            return Task.FromResult(new TokensResponseDto());
        }

        tokens = SortTokens(tokens, request.OrderBy, request.Order);

        var minPrice = tokens.Min(t => t.Price);
        var maxPrice = tokens.Max(t => t.Price);

        tokens = AppService.Paginate(
            tokens,
            request.PerPage == default ? General.DefaultPerPage : request.PerPage,
            request.Page == default ? General.DefaultPage : request.Page,
            out int totalPages);

        return Task.FromResult(new TokensResponseDto()
        {
            TotalPages = totalPages,
            Tokens = mapper.Map<ICollection<TokenDto>>(tokens),
            MaxPrice = maxPrice,
            MinPrice = minPrice
        });
    }

    private static IQueryable<TokenEntity> SortTokens(IQueryable<TokenEntity> tokens, string orderBy, string order)
    {
        switch (orderBy)
        {
            case SortOrder.By.Name:
                switch (order)
                {
                    case SortOrder.Asc:
                        return tokens.OrderBy(p => p.Name);
                    case SortOrder.Desc:
                        return tokens.OrderByDescending(p => p.Name);
                }
                break;
            case SortOrder.By.Date:
                switch (order)
                {
                    case SortOrder.Asc:
                        return tokens.OrderBy(p => p.CreatedAt);
                    case SortOrder.Desc:
                        return tokens.OrderByDescending(p => p.CreatedAt);
                }
                break;
            case SortOrder.By.Price:
                switch (order)
                {
                    case SortOrder.Asc:
                        return tokens.OrderBy(p => p.Price);
                    case SortOrder.Desc:
                        return tokens.OrderByDescending(p => p.Price);
                }
                break;
        }
        return tokens;
    }
}
