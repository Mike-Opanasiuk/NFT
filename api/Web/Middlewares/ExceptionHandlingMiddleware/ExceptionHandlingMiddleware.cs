using Microsoft.AspNetCore.Identity;
using Shared.CommonExceptions;
using System.Net;

namespace Web.Middlewares.ExceptionHandlingMiddleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate next;
    private readonly ILogger<ExceptionHandlingMiddleware> logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        this.next = next;
        this.logger = logger;
    }

    public async Task Invoke(HttpContext httpContext)
    {
        try
        {
            await next(httpContext);
        }
        catch (BadRequestRestException ex)
        {
            httpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            string message = ex.Message;
            logger.LogError(ex, ex.Message);
            await HandleExceptionAsync(httpContext, message, ex.Errors);
        }
        catch (Exception ex)
        {
            httpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            string message = "Internal Server Error";
            logger.LogError(ex, ex.Message);
            await HandleExceptionAsync(httpContext, message, null);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, string message, IEnumerable<IdentityError> errors)
    {
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync(new ExceptionDetails
        {
            StatusCode = context.Response.StatusCode,
            Message = message,
            Errors = errors
        }.ToString());
    }
}