
using Shared.Services.FileStorageService.Abstract;
using static Shared.AppConstant;

namespace Shared.Services.FileStorageService;

public class FileStorageService : IFileStorageService
{
    #region Public
    public void DeleteFile(string path)
    {
        if (IsFileExist(path))
        {
            File.Delete(path);
        }

        var fullPath = Path.Combine(GenerateCdnPath(), path);
        if (IsFileExist(fullPath))
        {
            File.Delete(fullPath);
        }
    }

    public string SaveUserAvatar(string base64file, string oldFileName, Guid itemId)
    {
        return SaveItemWithCdnSubfolder(base64file, oldFileName, itemId, CdnPath.UserAvatars.Item1);
    }

    public string SaveTokenImage(string base64file, string oldFileName, Guid itemId)
    {
        return SaveItemWithCdnSubfolder(base64file, oldFileName, itemId, CdnPath.TokenImages.Item1);
    }

    public string SaveCollectionImage(string base64file, string oldFileName, Guid itemId)
    {
        return SaveItemWithCdnSubfolder(base64file, oldFileName, itemId, CdnPath.CollectionImages.Item1);
    }

    public string SaveFile(string base64file, string oldFileName, Guid itemId)
    {
        return SaveItemWithCdnSubfolder(base64file, oldFileName, itemId);
    }

    #endregion

    #region Private
    private string GenerateCdnPath()
    {
        string workingDirectory = Environment.CurrentDirectory;

        string cdnDirectory = CdnPath.CdnDirectory.Item1;

        string cdnPath = Path.Combine(workingDirectory, cdnDirectory);

        // This will create a cdn directory if it does not exist
        CreateDirectoryIfNotExists(cdnPath);

        return cdnPath;
    }

    private void CreateDirectoryIfNotExists(string path)
    {
        if (!Directory.Exists(path))
        {
            Directory.CreateDirectory(path);
        }
    }

    private string GenerateFileName(string oldFileName, Guid itemId)
    {
        var fileExtension = Path.GetExtension(oldFileName);

        if (string.IsNullOrEmpty(fileExtension))
        {
            fileExtension = FileExtension.Jpg;
        }

        // This will generate fileName [guid].ext
        var fileName = itemId.ToString() + fileExtension;

        return fileName;
    }

    private string SaveItemWithCdnSubfolder(string base64file, string oldFileName, Guid itemId, string subfolderPath = "")
    {
        var fileName = GenerateFileName(oldFileName, itemId);

        var cdnPath = GenerateCdnPath();

        var itemsPath = cdnPath;

        if (!string.IsNullOrEmpty(subfolderPath))
        {
            itemsPath = Path.Combine(cdnPath, subfolderPath);
        }

        CreateDirectoryIfNotExists(itemsPath);

        var filePath = Path.Combine(itemsPath, fileName);

        File.WriteAllBytes(filePath, Convert.FromBase64String(base64file));

        return filePath;
    }

    public string SaveFile(string base64file, string fileName)
    {
        var cdnPath = GenerateCdnPath();

        var itemsPath = cdnPath;

        CreateDirectoryIfNotExists(itemsPath);

        var filePath = Path.Combine(itemsPath, fileName);

        File.WriteAllBytes(filePath, Convert.FromBase64String(base64file));

        return filePath;
    }

    public bool IsFileExist(string path)
    {
        return File.Exists(path) ||
               File.Exists(Path.Combine(GenerateCdnPath(), path));
    }
    #endregion
}
