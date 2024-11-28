using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using api.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace api.Controllers
{
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

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest model)
        {
            var result = await _signInManager.PasswordSignInAsync(model.Username, model.Password, false, false);

            if (!result.Succeeded)
            {
                return Unauthorized(new { message = "Invalid username or password." });
            }

            var user = await _userManager.FindByNameAsync(model.Username);
            if (user == null)
            {
                return Unauthorized(new { message = "User not found." });
            }

            var roles = await _userManager.GetRolesAsync(user);
            var token = GenerateJwtToken(user, roles);

            return Ok(new { token, roles });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest model)
        {
            if (model.Password != model.ConfirmPassword)
            {
                return BadRequest(new { message = "Passwords do not match." });
            }

            var reservedUsernames = new[] { "Admin", "Administrator", "Superuser", "Root", "Default_Producer" };
            if (reservedUsernames.Contains(model.Username, StringComparer.OrdinalIgnoreCase))
            {
                return BadRequest(new { message = "The username is reserved and cannot be used." });
            }

            var user = new IdentityUser { UserName = model.Username };
            var result = await _userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            if (string.IsNullOrEmpty(model.Role))
            {
                model.Role = UserRoles.RegularUser;
            }

            if (model.Role == UserRoles.Administrator)
            {
                await _userManager.DeleteAsync(user); // Rollback user creation
                return BadRequest(new { message = "You are not allowed to assign the Administrator role." });
            }

            if (!await _roleManager.RoleExistsAsync(model.Role))
            {
                return BadRequest(new { message = "Invalid role specified." });
            }

            await _userManager.AddToRoleAsync(user, model.Role);

            return Ok(new { message = "User registered successfully." });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok(new { message = "Logged out successfully." });
        }

        [HttpPost("changepassword")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest model)
        {
            var user = await _userManager.GetUserAsync(User);

            if (user == null)
            {
                return Unauthorized(new { message = "User not found." });
            }

            if (model.NewPassword != model.ConfirmPassword)
            {
                return BadRequest(new { message = "Passwords do not match." });
            }

            var result = await _userManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return Ok(new { message = "Password changed successfully." });
        }

        [HttpDelete("deleteaccount")]
        public async Task<IActionResult> DeleteAccount([FromBody] DeleteAccountRequest model)
        {
            var user = await _userManager.GetUserAsync(User);

            if (user == null)
            {
                return Unauthorized(new { message = "User not found." });
            }

            var passwordCheck = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);

            if (!passwordCheck.Succeeded)
            {
                return BadRequest(new { message = "Incorrect password." });
            }

            var result = await _userManager.DeleteAsync(user);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            await _signInManager.SignOutAsync();
            return Ok(new { message = "Account deleted successfully." });
        }

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

    // Request Models
    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class RegisterRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
        public string Role { get; set; }
    }

    public class ChangePasswordRequest
    {
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
        public string ConfirmPassword { get; set; }
    }

    public class DeleteAccountRequest
    {
        public string Password { get; set; }
    }
}
