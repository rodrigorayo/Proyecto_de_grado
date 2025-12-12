using League.Application.Features.Teams.Commands.CreateTeam;
using League.Application.Features.Teams.Commands.DeleteTeam; // <--- Nuevo
using League.Application.Features.Teams.Commands.UpdateTeam; // <--- Nuevo
using League.Application.Features.Teams.Queries.GetTeams;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace League.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeamsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public TeamsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var teams = await _mediator.Send(new GetTeamsQuery());
            return Ok(teams);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] CreateTeamCommand command)
        {
            try
            {
                var teamId = await _mediator.Send(command);
                return Ok(new { Id = teamId, Message = "Equipo creado exitosamente" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        // --- NUEVO: EDITAR ---
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateTeamCommand command)
        {
            if (id != command.Id) return BadRequest("ID del cuerpo no coincide con la URL.");

            try
            {
                await _mediator.Send(command);
                return Ok(new { Message = "Equipo actualizado correctamente" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        // --- NUEVO: ELIMINAR ---
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                await _mediator.Send(new DeleteTeamCommand(id));
                return Ok(new { Message = "Equipo eliminado correctamente" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }
    }
}