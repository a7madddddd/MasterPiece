using MasterPeiceCoreApi.DTOs;
using MasterPeiceCoreApi.Models;
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly MyDbContext _db;
    private bool CheckPasswordHash(string password, string passwordHash)
    {
        // Implement the BCrypt password verification logic here
        throw new NotImplementedException();
    }

    // Use CheckPasswordHash instead of VerifyPasswordHash
    private bool GetIsPasswordValid(LoginDTO loginDTO, User loginUser)
    {
        return CheckPasswordHash(loginDTO.Password, loginUser.PasswordHash);
    }


    public UsersController(MyDbContext db)
    {

        _db = db;
    }

    [HttpGet("Get All Users")]
    public IActionResult AllUsers()
    {

        var AllUsers = _db.Users.ToList();
        return Ok(AllUsers);
    }



    /// <summary>
    /// ///////////////////////////////
    /// </summary>
    /// <param name="userDto"></param>
    /// <returns></returns>
    [HttpPost("Register")]
    public IActionResult Register(UserDTO userDto)
    {
        var newUser = new User
        {
            Username = userDto.Username,
            FirstName = userDto.FirstName,
            LastName = userDto.LastName,
            Email = userDto.Email,
            PasswordHash = userDto.PasswordHash,
            ProfileImage = userDto.ProfileImage
        };

        _db.Users.Add(newUser);
        _db.SaveChanges();

        return Ok("User registered successfully.");
    }



    /// <summary>
    /// ///////////////////////////////
    /// </summary>
    /// <param name="userDto"></param>
    [HttpPut("EditUserProfile")]
    public IActionResult UpdateUser(UserDTO userDto)
    {
        // Find the existing user
        var existingUser = _db.Users.Find(userDto.UserId); // Assume UserDTO has a UserID property

        if (existingUser == null)
        {
            return NotFound("User not found");
        }

        // Update only the fields that are provided
        if (!string.IsNullOrEmpty(userDto.Username))
            existingUser.Username = userDto.Username;
        if (!string.IsNullOrEmpty(userDto.ProfileImage))
            existingUser.ProfileImage = userDto.ProfileImage;
        if (!string.IsNullOrEmpty(userDto.FirstName))
            existingUser.FirstName = userDto.FirstName;
        if (!string.IsNullOrEmpty(userDto.LastName))
            existingUser.LastName = userDto.LastName;

        // Don't update Email here as it's not in your DTO
        // If you need to update Email, make sure it's not null

        _db.SaveChanges();
        return Ok(existingUser);
    }


    /// <summary>
    /// ////////////////////////
    /// </summary>
    /// <param name="userName"></param>
    /// <returns></returns>
    [HttpGet("User By name")]
    public IActionResult UserByName(string userName)
    {
        var UserByName = _db.Users.Where(u => u.Username == userName);
        return Ok(UserByName);
    }
}


