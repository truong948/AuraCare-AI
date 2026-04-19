using Microsoft.AspNetCore.Mvc;
using Supabase;

namespace AuraCareApi.controller
{
  [ApiController]
  [Route("api/[controller]")]
  public class profileController : ControllerBase
  {
    private readonly ILogger<profileController> _logger;

    public profileController(ILogger<profileController> logger)
    {
      _logger = logger;
    }

    [HttpGet(Name = "Id")]
    public async Task<ActionResult> Get(string id)
    {
      var client = new Supabase.Client.From<model.profile>().where(p => p.Id == id).Get();
      await client.InitializeAsync();

      var profile = await client.From<Profile>().Where(p => p.Id == id).SingleAsync();

      if (profile == null)
      {
        return NotFound();
      }

      return Ok(profile);
    }

  }
}
