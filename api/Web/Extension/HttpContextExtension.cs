using Shared;
using System.Security.Claims;
using static Shared.AppConstant;

namespace Web.Extension;

public static class HttpContextExtension
{
    public static string GetCurrentUserId(this HttpContext httpContext)
    {
        return httpContext.User.Claims.FirstOrDefault(c => c.Type == Claims.Id).Value;
    }

    public static Guid GetCurrentUserGuid(this HttpContext httpContext)
    {
        return Guid.Parse(GetCurrentUserId(httpContext));
    }

    public static bool IsCurrentUserAdmin(this HttpContext httpContext)
    {
        var roles = httpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role);

        if (roles == null)
            return false;

        return roles.Value.Contains(Roles.Admin);
    }
}
