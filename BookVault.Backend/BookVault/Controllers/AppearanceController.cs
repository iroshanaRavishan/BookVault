using BookVault.Application.DTOs.AppearanceDTOs;
using BookVault.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BookVault.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppearanceController : ControllerBase
    {
        private readonly IAppearanceService _service;
    }
}
