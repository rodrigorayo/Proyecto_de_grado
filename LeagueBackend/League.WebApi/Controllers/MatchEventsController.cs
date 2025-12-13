using League.Application.Features.MatchEvents.Commands.AddEvent;
using League.Application.Features.MatchEvents.Queries.GetMatchEvents; // <--- Nuevo Using
using League.Application.Features.Stats.Queries.GetTopScorers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace League.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MatchEventsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public MatchEventsController(IMediator mediator) => _mediator = mediator;

        // POST: Agregar Gol/Tarjeta
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddEvent([FromBody] AddMatchEventCommand command)
        {
            try
            {
                var id = await _mediator.Send(command);
                return Ok(new { Id = id, Message = "Evento registrado correctamente" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message, InnerError = ex.InnerException?.Message });
            }
        }

        // GET: Eventos de UN partido específico
        [HttpGet("ByMatch/{matchId}")]
        public async Task<IActionResult> GetByMatch(Guid matchId)
        {
            var events = await _mediator.Send(new GetMatchEventsQuery(matchId));
            return Ok(events);
        }

        // GET: Tabla de Goleadores (Top 10)
        [HttpGet("TopScorers")]
        [AllowAnonymous]
        public async Task<IActionResult> GetTopScorers()
        {
            var scorers = await _mediator.Send(new GetTopScorersQuery(null));
            return Ok(scorers);
        }
    }
}