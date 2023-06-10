using Application.Features.TokenFeatures.Dtos;
using AutoMapper;
using Infrastructure.UnitOfWork.Abstract;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using Shared.CommonExceptions;

namespace Application.Features.TokenFeatures.Queries;

public record GetTokensByCollectionIdQuery : IRequest<IEnumerable<TokenDto>>
{
    public Guid CollectionId { get; set; }
}

public class GetTokensByCollectionIdHandler : IRequestHandler<GetTokensByCollectionIdQuery, IEnumerable<TokenDto>>
{
    private readonly IUnitOfWork unitOfWork;
    private readonly IMapper mapper;

    public GetTokensByCollectionIdHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        this.unitOfWork = unitOfWork;
        this.mapper = mapper;
    }

    public Task<IEnumerable<TokenDto>> Handle(GetTokensByCollectionIdQuery request, CancellationToken cancellationToken)
    {
        var tokens = unitOfWork.Tokens
            .Get()
            .Where(t => t.CollectionId == request.CollectionId)
            .Include(c => c.Author);

        return Task.FromResult(mapper.Map<IEnumerable<TokenDto>>(tokens));
    }
}