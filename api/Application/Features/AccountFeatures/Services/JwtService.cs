using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using static Shared.AppConstant;

namespace Application.Features.AccountFeatures.Services;

public class JwtService
{
    private const string SecurityAlgorithm = SecurityAlgorithms.HmacSha512Signature;
    private readonly SigningCredentials _signingCredentials;
    private readonly JwtSecurityTokenHandler _jwtTokenHandler;

    public JwtService(SymmetricSecurityKey securityKey)
    {
        _signingCredentials = new SigningCredentials(securityKey, SecurityAlgorithm);
        _jwtTokenHandler = new JwtSecurityTokenHandler();
    }

    public string GenerateToken(string userId, string userRoles, TimeSpan duration)
    {
        var descriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new Claim[]
            {
                    new(Claims.Id, userId, ClaimValueTypes.String),
                    new(Claims.Roles, userRoles, ClaimValueTypes.String)
            }),
            Expires = DateTime.UtcNow.Add(duration),
            SigningCredentials = _signingCredentials
        };

        var token = _jwtTokenHandler.CreateToken(descriptor);

        return _jwtTokenHandler.WriteToken(token);
    }
}
