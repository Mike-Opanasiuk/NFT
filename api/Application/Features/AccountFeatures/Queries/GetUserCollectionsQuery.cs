
using Application.Features.CollectionFeatures.Dtos;
using AutoMapper;
using Infrastructure.UnitOfWork.Abstract;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.AccountFeatures.Queries;

public record GetUserCollectionsQuery(Guid UserId) : IRequest<IEnumerable<CollectionDto>>;

public class GetUserCollectionsHandler : IRequestHandler<GetUserCollectionsQuery, IEnumerable<CollectionDto>>
{
    private readonly IUnitOfWork unitOfWork;
    private readonly IMapper mapper;

    public GetUserCollectionsHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        this.unitOfWork = unitOfWork;
        this.mapper = mapper;
    }

    public Task<IEnumerable<CollectionDto>> Handle(GetUserCollectionsQuery request, CancellationToken cancellationToken)
    {
        var collections = unitOfWork.Collections
            .Get()
            .Where(c => c.AuthorId == request.UserId)
            .Include(c => c.Tokens)
            .Include(c => c.Author);

        return Task.FromResult(mapper.Map<IEnumerable<CollectionDto>>(collections));
    }
}
