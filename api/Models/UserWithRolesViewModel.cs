namespace Sub_App_1.Models;

public class UserWithRolesViewModel {
    public string UserId { get; set; }
    public string Username { get; set; }
    public IList<string> Roles { get; set; }


    /* Constructer */ 
     public UserWithRolesViewModel()
    {
        UserId = string.Empty;
        Username = string.Empty;
        Roles = new List<string>();
    }
}
