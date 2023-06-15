using MediatR;
using Shared.CommonExceptions;
using Shared.Services.FileStorageService.Abstract;
using Shared.Services;
using Microsoft.AspNetCore.Identity;
using Core.Entities;

namespace Application.Features.AccountFeatures.Commands;

public class UpdateUserRequest
{
    public string Image { get; set; }
    public string ImageName { get; set; }
    public string Name { get; set; }
    public string Surname { get; set; }
    public string MobilePhone { get; set; }
    public string Country { get; set; }
    public string Region { get; set; }
}

public class UpdateUserCommand : UpdateUserRequest, IRequest
{
    public Guid UserId { get; set; }
}

public class UpdateUserHandler : IRequestHandler<UpdateUserCommand>
{
    private readonly UserManager<UserEntity> userManager;
    private readonly IFileStorageService fileStorageService;

    public UpdateUserHandler(IFileStorageService fileStorageService, UserManager<UserEntity> userManager)
    {
        this.fileStorageService = fileStorageService;
        this.userManager = userManager;
    }

    public async Task Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        var userId = request.UserId;
        var user = await userManager.FindByIdAsync(userId.ToString());

        if (user == null)
        {
            throw new BadRequestRestException($"User with id {userId} wasn`t found");
        }

        if (user.Image != request.ImageName // if image name is different it means that image was changed
            && !string.IsNullOrEmpty(request.Image)) // if new image is not empty
        {
            if (!AppService.IsStringHasBase64Format(request.Image))
            {
                throw new BadRequestRestException("Input image string was not in base64 format");
            }

            fileStorageService.DeleteFile(user.Image); // delete old image

            // save new image
            var actualImagePath = fileStorageService.SaveTokenImage(request.Image, request.ImageName, Guid.NewGuid());
            user.Image = actualImagePath;
        }

        user.Name = request.Name;
        user.Surname = request.Surname;
        user.MobilePhone = request.MobilePhone;
        user.Country = request.Country;
        user.Region = request.Region;

        await userManager.UpdateAsync(user);
    }
}