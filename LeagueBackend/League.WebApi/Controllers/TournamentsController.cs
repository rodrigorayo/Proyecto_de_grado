using League.Application.Features.Tournaments.Commands.CreateTournament;
using League.Application.Features.Tournaments.Commands.DeleteTournament;
using League.Application.Features.Tournaments.Commands.UpdateTournament;
using League.Application.Features.Tournaments.Queries.GetTournaments;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace League.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TournamentsController : ControllerBase
    {
        private readonly IMediator _mediator;
        public TournamentsController(IMediator mediator) => _mediator = mediator;

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _mediator.Send(new GetTournamentsQuery()));

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] CreateTournamentCommand command)
        {
            try { return Ok(new { Id = await _mediator.Send(command) }); }
            catch (Exception ex) { return BadRequest(new { Error = ex.Message }); }
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateTournamentCommand command)
        {
            if (id != command.Id) return BadRequest("ID mismatch");
            try { await _mediator.Send(command); return Ok(new { Message = "Actualizado" }); }
            catch (Exception ex) { return BadRequest(new { Error = ex.Message }); }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(Guid id)
        {
            try { await _mediator.Send(new DeleteTournamentCommand(id)); return Ok(new { Message = "Eliminado" }); }
            catch (Exception ex) { return BadRequest(new { Error = ex.Message }); }
        }
    }
}