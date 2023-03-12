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
}
