namespace api.Controllers;

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using api.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;

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
    /// <returns>
    /// A JWT token and roles if successful; otherwise, an unauthorized response.
    /// </returns>
    /// <response code="200">Returns the JWT token and roles.</response>
    /// <response code="401">Invalid username or password.</response>
    [HttpPost("login")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginRequest model)
    {
        if(string.IsNullOrWhiteSpace(model.Username) || string.IsNullOrWhiteSpace(model.Password))
        {
            return BadRequest( new { message = "Username and password are required." });
        }
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
    /// <returns>
    /// A success message if registration is successful; otherwise, a bad request response.
    /// </returns>
    /// <response code="200">User registered successfully.</response>
    /// <response code="400">Invalid input or role.</response>
    [HttpPost("register")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] RegisterRequest model)
    {
        if (model.Password != model.ConfirmPassword)
            return BadRequest(new { message = "Passwords do not match." });

        var reservedUsernames = new[] { "Admin", "Administrator", "Superuser", "Root", "Default_Producer" };
        if (reservedUsernames.Contains(model.Username, StringComparer.OrdinalIgnoreCase))
            return BadRequest(new { message = "The username is reserved and cannot be used." });

        var user = new IdentityUser { UserName = model.Username };
        if(string.IsNullOrWhiteSpace(model.Password))
        {
            return BadRequest(new { message = "Password is required." });
        }
        var result = await _userManager.CreateAsync(user, model.Password);
        if (!result.Succeeded) return BadRequest(new { errors = result.Errors });

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
    /// <response code="200">Logout successful.</response>
    [Authorize]
    [HttpPost("logout")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> Logout()
    {
        await _signInManager.SignOutAsync();
        return Ok(new { message = "Logged out successfully." });
    }

    /// <summary>
    /// Changes the password of the currently logged-in user.
    /// </summary>
    /// <param name="model">The password change details, including current, new, and confirmation passwords.</param>
    /// <returns>
    /// A success message if the password is changed; otherwise, an error response.
    /// </returns>
    /// <response code="200">Password changed successfully.</response>
    /// <response code="400">Invalid input (e.g., mismatched passwords).</response>
    /// <response code="401">User is unauthorized or not logged in.</response>
    [Authorize]
    [HttpPost("changepassword")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest model)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null) return Unauthorized(new { message = "User not found." });

        if (model.NewPassword != model.ConfirmPassword)
            return BadRequest(new { message = "Passwords do not match." });

        if (string.IsNullOrWhiteSpace(model.CurrentPassword) || string.IsNullOrWhiteSpace(model.NewPassword))
        {
            return BadRequest(new { message = "Current and new passwords are required." });
        }
        var result = await _userManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword);
        if (!result.Succeeded) return BadRequest(new { errors = result.Errors });

        return Ok(new { message = "Password changed successfully." });
    }

    /// <summary>
    /// Deletes the account of the currently logged-in user.
    /// </summary>
    /// <param name="model">The account deletion details, including the user's password for confirmation.</param>
    /// <returns>
    /// A success message if the account is deleted; otherwise, an error response.
    /// </returns>
    /// <response code="200">Account deleted successfully.</response>
    /// <response code="400">Invalid input or operation failed.</response>
    /// <response code="401">User is unauthorized or not logged in.</response>
    [Authorize]
    [HttpDelete("deleteaccount")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> DeleteAccount([FromBody] DeleteAccountRequest model)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null) return Unauthorized(new { message = "User not found." });

        if (string.IsNullOrWhiteSpace(model.Password))
        {
            return BadRequest(new { message = "Password is required." });
        }
        var passwordCheck = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);
        if (!passwordCheck.Succeeded) return BadRequest(new { message = "Incorrect password." });

        var result = await _userManager.DeleteAsync(user);
        if (!result.Succeeded) return BadRequest(new { errors = result.Errors });

        await _signInManager.SignOutAsync();
        return Ok(new { message = "Account deleted successfully." });
    }

    /// <summary>
    /// Generates a JSON Web Token (JWT) for the specified user, including their roles.
    /// </summary>
    /// <param name="user">The user for whom the token is being generated.</param>
    /// <param name="roles">A list of roles assigned to the user.</param>
    /// <returns>
    /// A string representation of the JWT token, which includes the user's claims and roles.
    /// </returns>
    /// <remarks>
    /// This method creates a signed JWT token containing the user's username, identifier, and assigned roles.
    /// The token is valid for 1 hour and is signed using the HMAC-SHA256 algorithm with a secret key.
    /// 
    /// Example claims included in the token:
    /// - Name: Represents the username.
    /// - NameIdentifier: Represents the unique identifier of the user.
    /// - Jti (JWT ID): A unique identifier for the token.
    /// - Role: Includes the roles assigned to the user.
    /// 
    /// Ensure the secret key and issuer/audience settings are securely configured in the application settings.
    /// </remarks>
    /// <exception cref="ArgumentNullException">
    /// Thrown if the <paramref name="user"/> parameter is null.
    /// </exception>
    /// <example>
    /// Example usage:
    /// <code>
    /// var token = GenerateJwtToken(user, new List&lt;string&gt; { "Administrator", "User" });
    /// Console.WriteLine(token); // Outputs the signed JWT token as a string
    /// </code>
    /// </example>
    private string GenerateJwtToken(IdentityUser user, IList<string> roles)
    {
        var authClaims = new List<Claim>
        {
            new Claim("name", user.UserName ?? "unknownUser"),
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        authClaims.AddRange(roles.Select(role => new Claim("role", role)));

        var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"] ?? string.Empty));

        var token = new JwtSecurityToken(
            issuer: _configuration["JWT:ValidIssuer"],
            audience: _configuration["JWT:ValidAudience"],
            expires: DateTime.UtcNow.AddHours(1), // Use UtcNow for consistency
            claims: authClaims,
            signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
