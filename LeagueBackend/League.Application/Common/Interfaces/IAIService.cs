using System.Threading.Tasks;

namespace League.Application.Common.Interfaces
{
    public interface IAIService
    {
        // Le enviamos una instrucción (Prompt) y nos devuelve el texto generado
        Task<string> GenerateTextAsync(string prompt);
    }
}