using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using League.Application.Common.Interfaces;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Threading.Tasks;

namespace League.Infrastructure.Services
{
    public class CloudinaryImageService : IImageService
    {
        private readonly Cloudinary _cloudinary;

        public CloudinaryImageService(IConfiguration configuration)
        {
            var cloudName = configuration["CloudinarySettings:CloudName"];
            var apiKey = configuration["CloudinarySettings:ApiKey"];
            var apiSecret = configuration["CloudinarySettings:ApiSecret"];

            var account = new Account(cloudName, apiKey, apiSecret);
            _cloudinary = new Cloudinary(account);
        }

        public async Task<string> UploadImageAsync(Stream fileStream, string fileName)
        {
            if (fileStream == null || fileStream.Length == 0)
                throw new Exception("El archivo está vacío.");

            // Resetear el stream a la posición 0 por si acaso
            fileStream.Position = 0;

            var uploadParams = new ImageUploadParams()
            {
                File = new FileDescription(fileName, fileStream),
                // Transformación opcional: Forzar formato webp y redimensionar si es muy grande
                Transformation = new Transformation().Quality("auto").FetchFormat("auto")
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

            if (uploadResult.Error != null)
            {
                throw new Exception($"Error subiendo imagen a Cloudinary: {uploadResult.Error.Message}");
            }

            return uploadResult.SecureUrl.ToString();
        }

        public async Task DeleteImageAsync(string publicId)
        {
            // Nota: Para borrar necesitamos el PublicId, que es la parte final de la URL sin la extensión.
            // Por ahora lo dejamos simple.
            var deletionParams = new DeletionParams(publicId);
            await _cloudinary.DestroyAsync(deletionParams);
        }
    }
}