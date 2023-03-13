using Application.Features.AccountFeatures.Commands;
using Application.Features.AccountFeatures.Dtos;
using Application.Features.CollectionFeatures.Commands;
using Application.Features.CollectionFeatures.Dtos;
using Application.Features.TokenFeatures.Dtos;
using AutoMapper;
using Core.Entities;

namespace Web;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        /*                          Users                             */
        CreateMap<UserEntity, UserDto>().ReverseMap();
        CreateMap<RegisterUserCommand, UserEntity>();

        /*                          Collections                             */
        CreateMap<CreateCollectionRequest, CreateCollectionCommand>();
        CreateMap<CreateCollectionCommand, CollectionEntity>();
        CreateMap<CollectionEntity, CollectionDto>().ReverseMap();
        CreateMap<DeleteCollectionRequest, DeleteCollectionCommand>();

        /*                          Tokens                             */
        CreateMap<TokenEntity, TokenDto>().ReverseMap();
    }
}
