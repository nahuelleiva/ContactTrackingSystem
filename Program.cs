using AutoMapper;
using ContactTrackingSystem.AutoMapper;
using ContactTrackingSystem.Contracts;
using ContactTrackingSystem.Logic;
using ContactTrackingSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace ContactTrackingSystem
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllersWithViews();
            builder.Services.AddDbContext<ContactTrackingSystemDbContext>(op =>
            {
                op.UseSqlite(builder.Configuration.GetConnectionString("DefaultDatabase"));
            });

            var config = new MapperConfiguration(cfg => 
            {
                cfg.AddProfile(new AutoMapperProfile());
            });
            var mapper = config.CreateMapper();
            builder.Services.AddSingleton(mapper);
            builder.Services.AddTransient<ILogicManager, LogicManager>();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseRouting();


            app.MapControllerRoute(
                name: "default",
                pattern: "{controller}/{action=Index}/{id?}");

            app.MapFallbackToFile("index.html");

            app.Run();
        }
    }
}