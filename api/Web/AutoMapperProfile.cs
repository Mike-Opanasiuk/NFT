using Application.Features.AccountFeatures.Commands;
using Application.Features.AccountFeatures.Dtos;
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
    }
}
