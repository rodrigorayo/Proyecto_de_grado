using League.Application.Features.Players.Commands.CreatePlayer;
using League.Application.Features.Players.Commands.DeletePlayer;
using League.Application.Features.Players.Commands.UpdatePlayer;
using League.Application.Features.Players.Queries.GetPlayersByTeam;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace League.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlayersController : ControllerBase
    {
        private readonly IMediator _mediator;

        public PlayersController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("ByTeam/{teamId}")]
        public async Task<IActionResult> GetByTeam(Guid teamId)
        {
            var players = await _mediator.Send(new GetPlayersByTeamQuery(teamId));
            return Ok(players);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] CreatePlayerCommand command)
        {
            try
            {
                var id = await _mediator.Send(command);
                return Ok(new { Id = id, Message = "Jugador registrado exitosamente" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdatePlayerCommand command)
        {
            if (id != command.Id) return BadRequest("ID no coincide.");

            try
            {
                await _mediator.Send(command);
                return Ok(new { Message = "Jugador actualizado correctamente" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                await _mediator.Send(new DeletePlayerCommand(id));
                return Ok(new { Message = "Jugador eliminado correctamente" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }
    }
}