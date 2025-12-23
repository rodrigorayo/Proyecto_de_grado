using League.Application.Common.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace League.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestAIController : ControllerBase
    {
        private readonly IAIService _aiService;

        public TestAIController(IAIService aiService)
        {
            _aiService = aiService;
        }

        [HttpGet("ask")]
        public async Task<IActionResult> Ask(string question)
        {
            var answer = await _aiService.GenerateTextAsync(question);
            return Ok(new { Pregunta = question, Respuesta = answer });
        }
    }
}