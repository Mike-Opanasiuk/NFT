using Core.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.FileProviders;
using Shared;
using System.IO;
using static Shared.AppConstant;

namespace Web.Extension;

public static partial class WebApplicationExtensions
{
    public static void UseCdn(this WebApplication app)
    {
        var cdnDirectoryPath = Path.Combine(Directory.GetCurrentDirectory(), CdnPath.CdnDirectory.Item1);

        // use base Cdn path
        UseStatisFiles(app, cdnDirectoryPath, CdnPath.CdnDirectory.Item2);

        // use other children paths
        UseAllCdnStaticFiles(app, cdnDirectoryPath);
    }

    /// <summary>
    /// use static files using reflection
    /// </summary>
    private static void UseAllCdnStaticFiles(WebApplication app, string baseDirectory)
    {
        Type type = typeof(CdnPath);

        // get all public fields in CdnPaths class
        foreach (var cdnPathField in type.GetFields().Where(f => f.IsPublic &&
        // and exclude base CdnDirectory
        !((Tuple<string, string>)f.GetValue(f)).Item1.Equals(CdnPath.CdnDirectory.Item1)))
        {
            var path = (Tuple<string, string>)cdnPathField.GetValue(cdnPathField);

            UseStatisFiles(app, Path.Combine(baseDirectory, path.Item1), path.Item2);
        }
    }

    private static void UseStatisFiles(WebApplication app, string filePath, string requestPath)
    {
        if (!Directory.Exists(filePath))
        {
            Directory.CreateDirectory(filePath);
        }

        app.UseStaticFiles(new StaticFileOptions
        {
            FileProvider = new PhysicalFileProvider(filePath),
            RequestPath = requestPath
        });
    }
}
