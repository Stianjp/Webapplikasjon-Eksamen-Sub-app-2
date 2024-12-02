namespace api.DAL.Repositories;

using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using api.DAL.Interfaces;
using System.Security.Claims;

/// <summary>
/// Provides user-related operations, including login, logout, registration, role management, and user retrieval.
/// </summary>
public class UserRepository : IUserRepository
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly ILogger<UserRepository> _logger;

    /// <summary>
    /// Initializes a new instance of the <see cref="UserRepository"/> class.
    /// </summary>
    /// <param name="userManager">The user manager for user-related operations.</param>
    /// <param name="signInManager">The sign-in manager for handling user authentication.</param>
    /// <param name="roleManager">The role manager for role-related operations.</param>
    /// <param name="logger">The logger for logging repository actions.</param>
    public UserRepository(
        UserManager<IdentityUser> userManager,
        SignInManager<IdentityUser> signInManager,
        RoleManager<IdentityRole> roleManager,
        ILogger<UserRepository> logger)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _roleManager = roleManager;
        _logger = logger;
    }

    /// <summary>
    /// Logs in a user with the provided credentials.
    /// </summary>
    /// <param name="username">The username of the user.</param>
    /// <param name="password">The user's password.</param>
    /// <returns>The result of the login attempt.</returns>
    /// <exception cref="ArgumentNullException">Thrown when the username is null or empty.</exception>
    public async Task<SignInResult> LoginAsync(string username, string password)
    {
        if (string.IsNullOrEmpty(username))
        {
            throw new ArgumentNullException(nameof(username));
        }
        return await _signInManager.PasswordSignInAsync(username, password, isPersistent: false, lockoutOnFailure: false);
    }

    /// <summary>
    /// Logs out the current user.
    /// </summary>
    public async Task LogoutAsync()
    {
        await _signInManager.SignOutAsync();
    }

    /// <summary>
    /// Registers a new user with the specified username and password.
    /// </summary>
    /// <param name="username">The username of the new user.</param>
    /// <param name="password">The password for the new user.</param>
    /// <returns>The result of the registration attempt.</returns>
    public async Task<IdentityResult> RegisterAsync(string username, string password)
    {
        var user = new IdentityUser { UserName = username };
        return await _userManager.CreateAsync(user, password);
    }

    /// <summary>
    /// Finds a user by their username.
    /// </summary>
    /// <param name="username">The username of the user to find.</param>
    /// <returns>The user with the specified username.</returns>
    /// <exception cref="Exception">Thrown when the user is not found.</exception>
    public async Task<IdentityUser> FindByNameAsync(string username)
    {
        var user = await _userManager.FindByEmailAsync(username);
        if (user == null)
        {
            throw new Exception($"User with username {username} not found");
        }
        return user;
    }

    /// <summary>
    /// Retrieves the roles associated with a user.
    /// </summary>
    /// <param name="user">The user to retrieve roles for.</param>
    /// <returns>A list of roles assigned to the user.</returns>
    public async Task<IList<string>> GetRolesAsync(IdentityUser user)
    {
        return await _userManager.GetRolesAsync(user);
    }

    /// <summary>
    /// Checks if a user belongs to a specific role.
    /// </summary>
    /// <param name="user">The user to check.</param>
    /// <param name="role">The role to check against.</param>
    /// <returns>True if the user is in the specified role; otherwise, false.</returns>
    public async Task<bool> IsInRoleAsync(IdentityUser user, string role)
    {
        return await _userManager.IsInRoleAsync(user, role);
    }

    /// <summary>
    /// Adds a user to a specific role.
    /// </summary>
    /// <param name="user">The user to add to the role.</param>
    /// <param name="role">The role to assign to the user.</param>
    /// <returns>The result of the operation.</returns>
    public async Task<IdentityResult> AddToRoleAsync(IdentityUser user, string role)
    {
        return await _userManager.AddToRoleAsync(user, role);
    }

    /// <summary>
    /// Changes the password of a user.
    /// </summary>
    /// <param name="user">The user whose password is to be changed.</param>
    /// <param name="currentPassword">The current password of the user.</param>
    /// <param name="newPassword">The new password to set.</param>
    /// <returns>The result of the password change operation.</returns>
    public async Task<IdentityResult> ChangePasswordAsync(IdentityUser user, string currentPassword, string newPassword)
    {
        return await _userManager.ChangePasswordAsync(user, currentPassword, newPassword);
    }

    /// <summary>
    /// Deletes a user.
    /// </summary>
    /// <param name="user">The user to delete.</param>
    /// <returns>The result of the deletion operation.</returns>
    public async Task<IdentityResult> DeleteUserAsync(IdentityUser user)
    {
        return await _userManager.DeleteAsync(user);
    }

    /// <summary>
    /// Removes a user from multiple roles.
    /// </summary>
    /// <param name="user">The user to remove from roles.</param>
    /// <param name="roles">The roles to remove.</param>
    /// <returns>The result of the operation.</returns>
    public async Task<IdentityResult> RemoveFromRolesAsync(IdentityUser user, IEnumerable<string> roles)
    {
        return await _userManager.RemoveFromRolesAsync(user, roles);
    }

    /// <summary>
    /// Adds a user to multiple roles.
    /// </summary>
    /// <param name="user">The user to add to roles.</param>
    /// <param name="roles">The roles to assign to the user.</param>
    /// <returns>The result of the operation.</returns>
    public async Task<IdentityResult> AddToRolesAsync(IdentityUser user, IEnumerable<string> roles)
    {
        return await _userManager.AddToRolesAsync(user, roles);
    }

    /// <summary>
    /// Retrieves the user associated with a given principal.
    /// </summary>
    /// <param name="principal">The claims principal of the user.</param>
    /// <returns>The user associated with the principal.</returns>
    /// <exception cref="KeyNotFoundException">Thrown when the user is not found.</exception>
    public async Task<IdentityUser> GetUserAsync(ClaimsPrincipal principal)
    {
        var user = await _userManager.GetUserAsync(principal);
        if (user == null)
        {
            throw new KeyNotFoundException("User not found");
        }
        return user;
    }

    /// <summary>
    /// Retrieves all users in the system.
    /// </summary>
    /// <returns>A list of all users.</returns>
    public async Task<List<IdentityUser>> GetAllUsersAsync()
    {
        return await _userManager.Users.ToListAsync();
    }

    /// <summary>
    /// Retrieves all roles in the system.
    /// </summary>
    /// <returns>A list of all roles.</returns>
    public async Task<List<IdentityRole>> GetAllRolesAsync()
    {
        return await _roleManager.Roles.ToListAsync();
    }

    /// <summary>
    /// Finds a user by their ID.
    /// </summary>
    /// <param name="userId">The ID of the user to find.</param>
    /// <returns>The user with the specified ID.</returns>
    /// <exception cref="KeyNotFoundException">Thrown when the user is not found.</exception>
    public async Task<IdentityUser> FindByIdAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            throw new KeyNotFoundException($"User with ID {userId} not found");
        }
        return user;
    }

    /// <summary>
    /// Checks if a role exists in the system.
    /// </summary>
    /// <param name="roleName">The name of the role to check.</param>
    /// <returns>True if the role exists; otherwise, false.</returns>
    public async Task<bool> RoleExistsAsync(string roleName)
    {
        return await _roleManager.RoleExistsAsync(roleName);
    }
}