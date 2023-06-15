﻿using Application.Features.AccountFeatures.Commands;
using Application.Features.AccountFeatures.Dtos;
using Application.Features.CollectionFeatures.Commands;
using Application.Features.CollectionFeatures.Dtos;
using Application.Features.TokenFeatures.Commands;
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
        CreateMap<UserEntity, FullUserDto>().ReverseMap();
        CreateMap<RegisterUserCommand, UserEntity>();
        CreateMap<UpdateUserRequest, UpdateUserCommand>();

        /*                          Collections                             */
        CreateMap<CreateCollectionRequest, CreateCollectionCommand>();
        CreateMap<CreateCollectionCommand, CollectionEntity>();
        CreateMap<CollectionEntity, CollectionDto>().ReverseMap();
        CreateMap<DeleteCollectionRequest, DeleteCollectionCommand>();
        CreateMap<UpdateCollectionCommand, CollectionEntity>();
        CreateMap<UpdateCollectionRequest, UpdateCollectionCommand>();

        /*                          Tokens                             */
        CreateMap<TokenEntity, TokenDto>().ReverseMap();
        CreateMap<CreateTokenCommand, TokenEntity>();
        CreateMap<CreateTokenRequest, CreateTokenCommand>();
        CreateMap<DeleteTokenRequest, DeleteTokenCommand>();
        CreateMap<UpdateTokenCommand, TokenEntity>();
        CreateMap<UpdateTokenRequest, UpdateTokenCommand>();
    }
}
