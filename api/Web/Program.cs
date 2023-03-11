using Application;
using Application.Features.AccountFeatures.Services;
using Core.Entities;
using FluentValidation;
using Infrastructure;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using NLog;
using NLog.Web;
using Shared;
using Web;
using Web.Extension;
using Web.Extensions;
using Web.Middlewares.ExceptionHandlingMiddleware;

var logger = LogManager.Setup().LoadConfigurationFromFile(AppConstant.General.NLogConfigPath).GetCurrentClassLogger();
logger.Debug("init main");

try
{
    var builder = WebApplication.CreateBuilder(args);

    // NLog: clean existing logging providers
    builder.Logging.ClearProviders();
    // NLog: setup custom NLog logging
    builder.Host.UseNLog();

    // Add services to the container.

    builder.Services.AddDbContext<ApplicationDbContext>(options =>
        options.UseSqlServer(builder.Configuration.GetConnectionString("Default")));

    builder.Services.AddIdentity<UserEntity, RoleEntity>()
                    .AddDefaultTokenProviders()
                    .AddEntityFrameworkStores<ApplicationDbContext>();

    builder.Services.AddBearer(builder.Configuration.GetValue<string>("Jwt:Secret"));
    builder.Services.AddScoped<JwtService>();

    builder.Services.AddMediatR(conf => conf.RegisterServicesFromAssembly(typeof(MediatrAssemblyReference).Assembly));

    builder.Services.AddAutoMapper(typeof(AutoMapperProfile));

    builder.Services.AddControllers();
    // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddValidatorsFromAssemblyContaining<FluentValidationAssemblyReference>(ServiceLifetime.Transient);

    builder.Services.AddSwaggerGen(c =>
    {
        // First we define the security scheme
        c.AddSecurityDefinition(
            "Bearer", // Name the security scheme
            new OpenApiSecurityScheme
            {
                Description = "JWT Authorization header using the Bearer scheme.",
                Type = SecuritySchemeType.Http, // We set the scheme type to http since we're using bearer authentication
                Scheme = "bearer" // The name of the HTTP Authorization scheme to be used in the Authorization header. In this case "bearer".
            });

        c.AddSecurityRequirement(
            new OpenApiSecurityRequirement
            {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Id = "Bearer",
                        Type = ReferenceType.SecurityScheme
                    }
                },
                new List<string>()
            }
        });
    });

    var app = builder.Build();

    app.UseSeed();

    // Configure the HTTP request pipeline.
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.UseMiddleware<ExceptionHandlingMiddleware>();

    app.UseHttpsRedirection();

    app.UseAuthentication();
    app.UseAuthorization();

    app.MapControllers();

    app.Run();
}
catch (Exception exception)
{
    // NLog: catch setup errors
    string type = exception.GetType().Name;
    if (type.Equals("StopTheHostException", StringComparison.Ordinal))
    {
        throw;
    }

    logger.Fatal(exception, "Unhandled exception");
}
finally
{
    // Ensure to flush and stop internal timers/threads before application-exit (Avoid segmentation fault on Linux)
    NLog.LogManager.Shutdown();
}