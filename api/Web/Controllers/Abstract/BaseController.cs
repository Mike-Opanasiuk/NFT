using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers.Abstract;

[ApiController]
[Route("api/[controller]")]
public abstract class BaseController : ControllerBase
{

}
