namespace AuraCareApi.DTOs
{
    public class UserProfileDto
    {
        public string FullName { get; set; } = string.Empty;
        public string SkinType { get; set; } = string.Empty;
        public List<string> Allergies { get; set; } = new List<string>();

        // DTO này giúp chúng ta ẩn đi ID hoặc các thông tin nhạy cảm 
        // của User khi trả về cho React/Vite.
    }
}