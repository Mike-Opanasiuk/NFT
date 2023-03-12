
namespace Shared.Services.FileStorageService.Abstract;

public interface IFileStorageService
{
    string SaveCollectionImage(string base64file, string oldFileName, Guid itemId);
    string SaveTokenImage(string base64file, string oldFileName, Guid itemId);
    string SaveUserAvatar(string base64file, string oldFileName, Guid itemId);
    string SaveFile(string base64file, string oldFileName, Guid itemId);
    string SaveFile(string base64file, string fileName);
    void DeleteFile(string path);
    bool IsFileExist(string path);
}
