using Application.Features.CollectionFeatures.Dtos;
using AutoMapper;
using Core.Entities;
using Infrastructure.UnitOfWork.Abstract;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Shared.CommonExceptions;
using Shared.Services;
using static Shared.AppConstant;

namespace Application.Features.CollectionFeatures.Queries;

public record GetCollectionByIdQuery : IRequest<CollectionDto>
{
    public Guid Id { get; set; }
}

public class GetCollectionByIdHandler : IRequestHandler<GetCollectionByIdQuery, CollectionDto>
{
    private readonly IUnitOfWork unitOfWork;
    private readonly IMapper mapper;

    public GetCollectionByIdHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        this.unitOfWork = unitOfWork;
        this.mapper = mapper;
    }

    public async Task<CollectionDto> Handle(GetCollectionByIdQuery request, CancellationToken cancellationToken)
    {
        var id = request.Id;
        var collection = await unitOfWork.Collections
            .Get()
            .Include(c => c.Author)
            .Include(c => c.Tokens)
            .FirstOrDefaultAsync(c => c.Id == id);

        if(collection == null)
        {
            throw new BadRequestRestException($"Collection does not exist.");
        }

        return mapper.Map<CollectionDto>(collection);
    }
}