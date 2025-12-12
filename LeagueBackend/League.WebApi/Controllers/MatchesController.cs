using League.Application.Features.Matches.Commands.CreateMatch;
using League.Application.Features.Matches.Queries.GetMatchesByTournament;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using League.Application.Features.Matches.Commands.RegisterMatchResult;

namespace League.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MatchesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public MatchesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // GET: api/Matches/ByTournament/{tournamentId}
        [HttpGet("ByTournament/{tournamentId}")]
        public async Task<IActionResult> GetByTournament(Guid tournamentId)
        {
            var matches = await _mediator.Send(new GetMatchesByTournamentQuery(tournamentId));
            return Ok(matches);
        }

        // POST: api/Matches
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] CreateMatchCommand command)
        {
            try
            {
                var id = await _mediator.Send(command);
                return Ok(new { Id = id, Message = "Partido programado exitosamente" });
            }
            catch (Exception ex)
            {
                // AQUÍ ESTÁ EL CAMBIO PARA VER EL ERROR REAL
                return BadRequest(new
                {
                    Error = ex.Message,
                    InnerError = ex.InnerException?.Message ?? "No hay detalles adicionales."
                });
            }
        }

        // PUT: api/Matches/{id}/Result
        [HttpPut("{id}/Result")]
        [Authorize]
        public async Task<IActionResult> RegisterResult(Guid id, [FromBody] RegisterMatchResultCommand command)
        {
            if (id != command.MatchId) return BadRequest("ID mismatch");

            try
            {
                await _mediator.Send(command);
                return Ok(new { Message = "Resultado registrado correctamente" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }
    }
}