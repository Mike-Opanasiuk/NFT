using Microsoft.AspNetCore.Identity;

namespace Shared.CommonExceptions;

/// <summary>
/// custom Exception to throw when bad request from rest occurs
/// </summary>
public class BadRequestRestException : Exception
{
    /// <summary>
    /// list of errors from Identity
    /// </summary>
    public IEnumerable<IdentityError> Errors { get; }

    public BadRequestRestException(string message, IEnumerable<IdentityError> errors = null)
        : base(message)
    {
        Errors = errors;
    }
}
