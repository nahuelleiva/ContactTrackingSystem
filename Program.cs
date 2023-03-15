using AutoMapper;
using ContactTrackingSystem.AutoMapper;
using ContactTrackingSystem.Contracts;
using ContactTrackingSystem.Logic;
using ContactTrackingSystem.Models;
using ContactTrackingSystem.StringUtils;
using Microsoft.EntityFrameworkCore;
using Serilog;
using Serilog.Events;

namespace ContactTrackingSystem
{
    public class Program
    {
        private const string DefaultCorsPolicyName = "Default";

        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            ConfigureServices(builder);
            ConfigureDBContext(builder);
            ConfigureSerilog(builder);
            ConfigureAutoMapper(builder);
            ConfigureCors(builder);

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "ContactTrackingSystem API V1");
            });
            app.UseRouting();


            app.MapControllerRoute(
                name: "default",
                pattern: "{controller}/{action=Index}/{id?}");

            app.MapFallbackToFile("index.html");

            app.Run();
        }

        private static void ConfigureServices(WebApplicationBuilder builder)
        {
            // Add services to the container.
            builder.Services.AddControllersWithViews();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1",
                    new Microsoft.OpenApi.Models.OpenApiInfo
                    {
                        Title = "Contact Tracking System",
                        Description = "Angular application with Swagger",
                        Version = "V1"
                    });
            });

            builder.Services.AddTransient<ILogicManager, LogicManager>();
        }

        private static void ConfigureDBContext(WebApplicationBuilder builder)
        {
            // Adding DB Context
            builder.Services.AddDbContext<ContactTrackingSystemDbContext>(op =>
            {
                op.UseSqlite(builder.Configuration.GetConnectionString("DefaultDatabase"));
            });
        }

        private static void ConfigureSerilog(WebApplicationBuilder builder)
        {
            var logger = new LoggerConfiguration()
                .MinimumLevel.Debug()
                .MinimumLevel.Override("Microsoft", LogEventLevel.Debug)
                .MinimumLevel.Override("Microsoft.EntityFrameworkCore", LogEventLevel.Warning)
                .Enrich.FromLogContext()
                .WriteTo.Async(c => c.File("Logs/logs_" + DateTime.UtcNow.ToString("yyyyMMdd") + "_.txt"))
                .CreateLogger();

            // Adding Serilog
            builder.Logging.ClearProviders();
            builder.Logging.AddSerilog(logger);
        }

        private static void ConfigureAutoMapper(WebApplicationBuilder builder)
        {
            // Configure AutoMapper profile
            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile(new AutoMapperProfile());
            });
            var mapper = config.CreateMapper();
            builder.Services.AddSingleton(mapper);
        }

        private static void ConfigureCors(WebApplicationBuilder builder)
        {
            builder.Services.AddCors(options =>
            {
                options.AddPolicy(DefaultCorsPolicyName, b =>
                {
                        b.WithOrigins(
                            builder.Configuration["App:CorsOrigins"]
                                .Split(",", StringSplitOptions.RemoveEmptyEntries)
                                .Select(o => o.RemovePostFix("/"))
                                .ToArray()
                        )
                        .SetIsOriginAllowedToAllowWildcardSubdomains()
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                });
            });
        }
    }
}