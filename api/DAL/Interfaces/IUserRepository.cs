// DAL/Interfaces/IUserRepository.cs
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace Sub_App_1.DAL.Interfaces
{
    public interface IUserRepository
    {
        Task<SignInResult> LoginAsync(string username, string password);
        Task LogoutAsync();
        Task<IdentityResult> RegisterAsync(string username, string password);
        Task<IdentityUser> FindByNameAsync(string username);
        Task<IList<string>> GetRolesAsync(IdentityUser user);
        Task<bool> IsInRoleAsync(IdentityUser user, string role);
        Task<IdentityResult> AddToRoleAsync(IdentityUser user, string role);
        Task<IdentityResult> ChangePasswordAsync(IdentityUser user, string currentPassword, string newPassword);
        Task<IdentityResult> DeleteUserAsync(IdentityUser user);
        Task<IdentityResult> RemoveFromRolesAsync(IdentityUser user, IEnumerable<string> roles);
        Task<IdentityResult> AddToRolesAsync(IdentityUser user, IEnumerable<string> roles);
        Task<IdentityUser> GetUserAsync(ClaimsPrincipal principal);
        Task<List<IdentityUser>> GetAllUsersAsync();
        Task<List<IdentityRole>> GetAllRolesAsync();
        Task<IdentityUser> FindByIdAsync(string userId);
        Task<bool> RoleExistsAsync(string roleName);
    }
}
