using System.IO;
using System.Threading.Tasks;

namespace League.Application.Common.Interfaces
{
    public interface IImageService
    {
        // Recibe el flujo de datos (Stream) y el nombre, devuelve la URL pública
        Task<string> UploadImageAsync(Stream fileStream, string fileName);

        // Opcional: Para borrar imágenes viejas si actualizan el logo
        Task DeleteImageAsync(string publicId);
    }
}