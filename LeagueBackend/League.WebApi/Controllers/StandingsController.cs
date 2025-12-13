using League.Application.DTOs;
using League.Application.Features.Standings.Queries.GetStandings;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace League.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StandingsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public StandingsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // GET: api/Standings/{tournamentId}
        [HttpGet("{tournamentId}")]
        public async Task<ActionResult<List<TeamStandingDto>>> GetByTournament(Guid tournamentId)
        {
            var query = new GetStandingsQuery(tournamentId);
            var result = await _mediator.Send(query);
            return Ok(result);
        }
    }
}