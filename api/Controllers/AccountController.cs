namespace api.Controllers;

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using api.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

/// <summary>
/// Handles account-related actions, such as login, registration, password changes, and account deletion.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly IConfiguration _configuration;

    public AccountController(
        UserManager<IdentityUser> userManager,
        SignInManager<IdentityUser> signInManager,
        RoleManager<IdentityRole> roleManager,
        IConfiguration configuration)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _roleManager = roleManager;
        _configuration = configuration;
    }

    /// <summary>
    /// Logs a user in and generates a JWT token.
    /// </summary>
    /// <param name="model">The login credentials, including username and password.</param>
    /// <returns>A JWT token and roles if successful; otherwise, an unauthorized response.</returns>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest model)
    {
        var result = await _signInManager.PasswordSignInAsync(model.Username, model.Password, false, false);
        if (!result.Succeeded) return Unauthorized(new { message = "Invalid username or password." });

        var user = await _userManager.FindByNameAsync(model.Username);
        if (user == null) return Unauthorized(new { message = "User not found." });

        var roles = await _userManager.GetRolesAsync(user);
        var token = GenerateJwtToken(user, roles);

        return Ok(new { token, roles });
    }

    /// <summary>
    /// Registers a new user with optional role assignment.
    /// </summary>
    /// <param name="model">The registration details, including username, password, and role.</param>
    /// <returns>A success message if registration is successful; otherwise, a bad request response.</returns>
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest model)
    {
        if (model.Password != model.ConfirmPassword)
            return BadRequest(new { message = "Passwords do not match." });

        var reservedUsernames = new[] { "Admin", "Administrator", "Superuser", "Root", "Default_Producer" };
        if (reservedUsernames.Contains(model.Username, StringComparer.OrdinalIgnoreCase))
            return BadRequest(new { message = "The username is reserved and cannot be used." });

        var user = new IdentityUser { UserName = model.Username };
        var result = await _userManager.CreateAsync(user, model.Password);
        if (!result.Succeeded) return BadRequest(result.Errors);

        model.Role ??= UserRoles.RegularUser;

        if (model.Role == UserRoles.Administrator)
        {
            await _userManager.DeleteAsync(user); // Rollback user creation
            return BadRequest(new { message = "You are not allowed to assign the Administrator role." });
        }

        if (!await _roleManager.RoleExistsAsync(model.Role))
            return BadRequest(new { message = "Invalid role specified." });

        await _userManager.AddToRoleAsync(user, model.Role);

        return Ok(new { message = "User registered successfully." });
    }

    /// <summary>
    /// Logs the current user out.
    /// </summary>
    /// <returns>A success message indicating the user has logged out.</returns>
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await _signInManager.SignOutAsync();
        return Ok(new { message = "Logged out successfully." });
    }

    /// <summary>
    /// Changes the password of the currently logged-in user.
    /// </summary>
    /// <param name="model">The password change details, including current, new, and confirmation passwords.</param>
    /// <returns>A success message if the password is changed; otherwise, an error response.</returns>
    [HttpPost("changepassword")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest model)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null) return Unauthorized(new { message = "User not found." });

        if (model.NewPassword != model.ConfirmPassword)
            return BadRequest(new { message = "Passwords do not match." });

        var result = await _userManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword);
        if (!result.Succeeded) return BadRequest(result.Errors);

        return Ok(new { message = "Password changed successfully." });
    }

    /// <summary>
    /// Deletes the account of the currently logged-in user.
    /// </summary>
    /// <param name="model">The account deletion details, including the user's password for confirmation.</param>
    /// <returns>A success message if the account is deleted; otherwise, an error response.</returns>
    [HttpDelete("deleteaccount")]
    public async Task<IActionResult> DeleteAccount([FromBody] DeleteAccountRequest model)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null) return Unauthorized(new { message = "User not found." });

        var passwordCheck = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);
        if (!passwordCheck.Succeeded) return BadRequest(new { message = "Incorrect password." });

        var result = await _userManager.DeleteAsync(user);
        if (!result.Succeeded) return BadRequest(result.Errors);

        await _signInManager.SignOutAsync();
        return Ok(new { message = "Account deleted successfully." });
    }

    /// <summary>
    /// Generates a JWT token for a user with their roles.
    /// </summary>
    /// <param name="user">The user for whom the token is being generated.</param>
    /// <param name="roles">The roles associated with the user.</param>
    /// <returns>A JWT token as a string.</returns>
    private string GenerateJwtToken(IdentityUser user, IList<string> roles)
    {
        var authClaims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        authClaims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));

        var token = new JwtSecurityToken(
            issuer: _configuration["JWT:ValidIssuer"],
            audience: _configuration["JWT:ValidAudience"],
            expires: DateTime.Now.AddHours(1),
            claims: authClaims,
            signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
