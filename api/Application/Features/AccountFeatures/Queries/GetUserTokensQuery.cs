
using Application.Features.TokenFeatures.Dtos;
using AutoMapper;
using Infrastructure.UnitOfWork.Abstract;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.AccountFeatures.Queries;

public record GetUserTokensQuery(Guid UserId) : IRequest<IEnumerable<TokenDto>>;

public class GetUserTokensHandler : IRequestHandler<GetUserTokensQuery, IEnumerable<TokenDto>>
{
    private readonly IUnitOfWork unitOfWork;
    private readonly IMapper mapper;

    public GetUserTokensHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        this.unitOfWork = unitOfWork;
        this.mapper = mapper;
    }

    public Task<IEnumerable<TokenDto>> Handle(GetUserTokensQuery request, CancellationToken cancellationToken)
    {
        var tokens = unitOfWork.Tokens
            .Get()
            .Where(t => t.AuthorId == request.UserId)
            .Include(t => t.Author)
            .Include(t => t.Collection);

        return Task.FromResult(mapper.Map<IEnumerable<TokenDto>>(tokens));
    }
}
