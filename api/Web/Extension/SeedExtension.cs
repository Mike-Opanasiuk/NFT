using Core.Entities;
using Infrastructure;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Shared;
using static Shared.AppConstant.Roles;

namespace Web.Extensions;

public static partial class WebApplicationExtensions
{
    public static void UseSeed(this WebApplication app)
    {
        using (var scope = app.Services.CreateScope())
        {
            var context = scope.ServiceProvider.GetService<ApplicationDbContext>();
            var roleManager = scope.ServiceProvider.GetService<RoleManager<RoleEntity>>();

            context.Database.Migrate();

            SeedRoles(roleManager).Wait();
        }
    }

    /// <summary>
    /// seed roles using reflection
    /// </summary>
    /// <param name="roleManager">role manager to manage roles</param>
    /// <returns>awaited Task</returns>
    private static async Task SeedRoles(RoleManager<RoleEntity> roleManager)
    {
        Type type = typeof(AppConstant.Roles);

        foreach (var roleField in type.GetFields().Where(f => f.IsPublic))
        {
            var role = new RoleEntity()
            {
                Name = roleField.GetValue(roleField)?.ToString()
            };

            var isRoleExist = await roleManager.RoleExistsAsync(role.Name);

            if (!isRoleExist)
            {
                await roleManager.CreateAsync(role);
            }
        }
    }
}