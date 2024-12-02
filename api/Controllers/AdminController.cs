namespace api.Controllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using api.Models;

/// <summary>
/// Provides administrative functionalities for managing users and roles.
/// Requires the user to have the Administrator role.
/// </summary>
[Authorize]
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

    /// <summary>
    /// Retrieves a list of all users along with their assigned roles.
    /// </summary>
    /// <returns>A list of users with their roles.</returns>
    /// <response code="200">Returns the list of users with roles.</response>
    [HttpGet("usermanager")]
    [ProducesResponseType(StatusCodes.Status200OK)]
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

    /// <summary>
    /// Retrieves details for a specific user, including their roles.
    /// </summary>
    /// <param name="id">The ID of the user.</param>
    /// <returns>The user's details and all available roles.</returns>
    /// <response code="200">Returns the user's details and roles.</response>
    /// <response code="404">If the user is not found.</response>
    [HttpGet("edituser/{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
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

    /// <summary>
    /// Updates the roles of a specific user.
    /// </summary>
    /// <param name="model">The user ID and the new roles to assign.</param>
    /// <returns>A success message if roles are updated successfully.</returns>
    /// <response code="200">If the user's roles are updated successfully.</response>
    /// <response code="404">If the user is not found.</response>
    /// <response code="400">If there is an error updating the roles.</response>
    [HttpPut("edituser")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
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

    /// <summary>
    /// Deletes a specific user by ID.
    /// </summary>
    /// <param name="id">The ID of the user to delete.</param>
    /// <returns>A success message if the user is deleted successfully.</returns>
    /// <response code="200">If the user is deleted successfully.</response>
    /// <response code="404">If the user is not found.</response>
    /// <response code="400">If there is an error deleting the user.</response>
    [HttpDelete("deleteuser/{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> DeleteUser(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null) return NotFound(new { message = "User not found." });

        var result = await _userManager.DeleteAsync(user);
        if (!result.Succeeded) return BadRequest(new { message = "Error deleting user." });

        return Ok(new { message = "User deleted successfully!" });
    }
}
