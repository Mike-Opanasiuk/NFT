
using Application.Features.CollectionFeatures.Dtos;
using Application.Features.TokenFeatures.Dtos;
using AutoMapper;
using Infrastructure.UnitOfWork.Abstract;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Shared.CommonExceptions;

namespace Application.Features.TokenFeatures.Queries;


public record GetTokenByIdQuery : IRequest<TokenDto>
{
    public Guid Id { get; set; }
}

public class GetTokenByIdHandler : IRequestHandler<GetTokenByIdQuery, TokenDto>
{
    private readonly IUnitOfWork unitOfWork;
    private readonly IMapper mapper;

    public GetTokenByIdHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        this.unitOfWork = unitOfWork;
        this.mapper = mapper;
    }

    public async Task<TokenDto> Handle(GetTokenByIdQuery request, CancellationToken cancellationToken)
    {
        var id = request.Id;
        var token = await unitOfWork.Tokens
            .Get()
            .Include(c => c.Author)
            .FirstOrDefaultAsync(c => c.Id == id, cancellationToken);

        return token == null ?
            throw new BadRequestRestException($"Token does not exist.") :
            mapper.Map<TokenDto>(token);
    }
} 