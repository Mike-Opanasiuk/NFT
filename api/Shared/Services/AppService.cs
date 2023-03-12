
namespace Shared.Services;

public class AppService
{
    #region Public
    public static IQueryable<T> Paginate<T>(IQueryable<T> items, int perPage, int page, out int totalPages)
    {
        var count = items.Count();

        items = items.Skip((page - 1) * perPage).Take(perPage);

        if (count <= perPage && count != 0)
        {
            totalPages = 1;
            return items;
        }

        totalPages = count / perPage;

        if (totalPages % perPage > 0)
        {
            ++totalPages;
        }
        return items;
    }

    public static bool IsStringHasBase64Format(string base64)
    {
        if (base64 == null)
        {
            return false;
        }

        try
        {
            Span<byte> buffer = new Span<byte>(new byte[base64.Length]);
            return Convert.TryFromBase64String(base64, buffer, out int bytesParsed);
        }
        catch (ArgumentNullException)
        {
            return false;
        }
    }
    #endregion
}
