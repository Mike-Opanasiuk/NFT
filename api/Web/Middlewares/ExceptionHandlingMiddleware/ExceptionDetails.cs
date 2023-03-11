using Microsoft.AspNetCore.Identity;
using System.Text.Json;

namespace Web.Middlewares.ExceptionHandlingMiddleware;

public class ExceptionDetails
{
    public int StatusCode { get; set; }
    public string Message { get; set; }
    public IEnumerable<IdentityError> Errors { get; set; }

    public override string ToString()
    {
        return JsonSerializer.Serialize(this);
    }
}
