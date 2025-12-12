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

        [HttpGet("{tournamentId}")]
        public async Task<IActionResult> Get(Guid tournamentId)
        {
            var table = await _mediator.Send(new GetStandingsQuery(tournamentId));
            return Ok(table);
        }
    }
}