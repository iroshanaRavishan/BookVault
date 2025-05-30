using BookVault.Domain.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BookVault.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DefaultUserProfilePictureController : ControllerBase
    {
        private readonly IDefaultUserProfilePictureRepository _defaultUserProfilePictureService;
        public DefaultUserProfilePictureController(IDefaultUserProfilePictureRepository defaultUserProfilePictureService)
        {
            _defaultUserProfilePictureService = defaultUserProfilePictureService;
        }
    }
}
