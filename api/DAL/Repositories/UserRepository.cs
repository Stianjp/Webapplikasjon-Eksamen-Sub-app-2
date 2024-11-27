namespace Sub_App_1.DAL.Repositories;

using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Sub_App_1.DAL.Interfaces;
using System.Security.Claims;

public class UserRepository : IUserRepository
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly ILogger<UserRepository> _logger;

    public UserRepository(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, RoleManager<IdentityRole> roleManager, ILogger<UserRepository> logger)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _roleManager = roleManager;
        _logger = logger;
    }

    public async Task<SignInResult> LoginAsync(string username, string password)
    {
        if (string.IsNullOrEmpty(username)){
            throw new ArgumentNullException(nameof(username));
        }
        return await _signInManager.PasswordSignInAsync(username, password, isPersistent: false, lockoutOnFailure: false);
    }

    public async Task LogoutAsync()
    {
        await _signInManager.SignOutAsync();
    }

    public async Task<IdentityResult> RegisterAsync(string username, string password)
    {
        var user = new IdentityUser { UserName = username };
        return await _userManager.CreateAsync(user, password);
    }

    public async Task<IdentityUser> FindByNameAsync(string username)
    {
        var user = await _userManager.FindByEmailAsync(username);
        if( user == null){
            throw new Exception($"User with username {username} not found");
        }
        return user;
    }

    public async Task<IList<string>> GetRolesAsync(IdentityUser user)
    {
        return await _userManager.GetRolesAsync(user);
    }

    public async Task<bool> IsInRoleAsync(IdentityUser user, string role)
    {
        return await _userManager.IsInRoleAsync(user, role);
    }

    public async Task<IdentityResult> AddToRoleAsync(IdentityUser user, string role)
    {
        return await _userManager.AddToRoleAsync(user, role);
    }

    public async Task<IdentityResult> ChangePasswordAsync(IdentityUser user, string currentPassword, string newPassword)
    {
        return await _userManager.ChangePasswordAsync(user, currentPassword, newPassword);
    }

    public async Task<IdentityResult> DeleteUserAsync(IdentityUser user)
    {
        return await _userManager.DeleteAsync(user);
    }

    public async Task<IdentityResult> RemoveFromRolesAsync(IdentityUser user, IEnumerable<string> roles)
    {
        return await _userManager.RemoveFromRolesAsync(user, roles);
    }

    public async Task<IdentityResult> AddToRolesAsync(IdentityUser user, IEnumerable<string> roles)
    {
        return await _userManager.AddToRolesAsync(user, roles);
    }

    public async Task<IdentityUser> GetUserAsync(ClaimsPrincipal principal)
    {
        var user = await _userManager.GetUserAsync(principal);
        if (user == null)
        {
            throw new KeyNotFoundException("User not found");
            // Or return a new IdentityUser() if you prefer
        }
        return user;
        
    }

    public async Task<List<IdentityUser>> GetAllUsersAsync()
    {
        return await _userManager.Users.ToListAsync();
    }

    public async Task<List<IdentityRole>> GetAllRolesAsync()
    {
        return await _roleManager.Roles.ToListAsync();
    }

    public async Task<IdentityUser> FindByIdAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            throw new KeyNotFoundException($"User with ID {userId} not found");
            // Or return a new IdentityUser() if you prefer
        }
        return user;
    }

    public async Task<bool> RoleExistsAsync(string roleName)
    {
        return await _roleManager.RoleExistsAsync(roleName);
    }
}