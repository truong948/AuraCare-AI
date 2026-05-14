using Microsoft.AspNetCore.Mvc;
using Supabase;

namespace AuraCareApi.Controllers
{
    [ApiController] // Chỉ định đây là một Web API Controller
    [Route("api/[controller]")] // Đường dẫn sẽ là: api/SkinProfile
    public class SkinProfileController : ControllerBase
    {
        private readonly Supabase.Client _supabaseClient;

        // Dependency Injection: Lấy Supabase Client đã cấu hình ở Program.cs
        public SkinProfileController(Supabase.Client supabaseClient)
        {
            _supabaseClient = supabaseClient;
        }

        // 1. Lấy thông tin da của người dùng (GET)
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProfile(string id)
        {
            var result = await _supabaseClient.From<Models.Profile>()
                .Where(x => x.Id == id)
                .Get();

            if (result.Model == null) return NotFound("Không tìm thấy profile!");
            return Ok(result.Model);
        }

        // 2. Cập nhật tình trạng da mới (POST/PUT)
        [HttpPost]
        public async Task<IActionResult> CreateProfile([FromBody] Models.Profile newProfile)
        {
            var result = await _supabaseClient.From<Models.Profile>().Insert(newProfile);
            return Ok("Đã lưu thông tin da thành công!");
        }
    }
}