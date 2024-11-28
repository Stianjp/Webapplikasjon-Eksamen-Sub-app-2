namespace api.Controllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using api.Models;

[Authorize(Roles = UserRoles.Administrator)]
[Route("api/[controller]")]
[ApiController]
public class AdminController : ControllerBase
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;

    public AdminController(UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager)
    {
        _userManager = userManager;
        _roleManager = roleManager;
    }

    // GET: api/Admin/UserManager
    [HttpGet("usermanager")]
    public async Task<IActionResult> GetUsers()
    {
        var users = _userManager.Users.ToList();
        var userWithRoles = new List<UserWithRolesViewModel>();

        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            userWithRoles.Add(new UserWithRolesViewModel
            {
                UserId = user.Id,
                Username = user.UserName ?? string.Empty,
                Roles = roles
            });
        }

        return Ok(userWithRoles);
    }

    // GET: api/Admin/EditUser/{id}
    [HttpGet("edituser/{id}")]
    public async Task<IActionResult> GetUser(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null) return NotFound(new { message = "User not found." });

        var roles = await _userManager.GetRolesAsync(user);

        var model = new UserWithRolesViewModel
        {
            UserId = user.Id,
            Username = user.UserName ?? string.Empty,
            Roles = roles.ToList()
        };

        var allRoles = _roleManager.Roles.Select(r => r.Name).Where(r => r != null).ToList();

        return Ok(new { user = model, allRoles });
    }

    // PUT: api/Admin/EditUser
    [HttpPut("edituser")]
    public async Task<IActionResult> UpdateUserRoles([FromBody] UserWithRolesViewModel model)
    {
        var user = await _userManager.FindByIdAsync(model.UserId);
        if (user == null) return NotFound(new { message = "User not found." });

        var currentRoles = await _userManager.GetRolesAsync(user);
        var removeResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);
        if (!removeResult.Succeeded) return BadRequest(new { message = "Error removing user roles." });

        var addResult = await _userManager.AddToRolesAsync(user, model.Roles);
        if (!addResult.Succeeded) return BadRequest(new { message = "Error adding roles to user." });

        return Ok(new { message = "User roles updated successfully!" });
    }

    // DELETE: api/Admin/DeleteUser/{id}
    [HttpDelete("deleteuser/{id}")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null) return NotFound(new { message = "User not found." });

        var result = await _userManager.DeleteAsync(user);
        if (!result.Succeeded) return BadRequest(new { message = "Error deleting user." });

        return Ok(new { message = "User deleted successfully!" });
    }
}
