using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using API.Helpers;
using API.Middleware;
using StackExchange.Redis;
using API.Extentions;
using API.Extensions;
using Stripe;
using System.Net.NetworkInformation;
using Microsoft.Extensions.FileProviders;
using Serilog;
using Serilog.Events;




Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Debug()
    .WriteTo.Console()

    // Info & Warning Logs
    .WriteTo.Logger(lc => lc
        .Filter.ByIncludingOnly(le => le.Level == LogEventLevel.Information || le.Level == LogEventLevel.Warning)
        .WriteTo.File("Logs/info-.txt", rollingInterval: RollingInterval.Day, retainedFileCountLimit: 10)
    )

    // Error & Fatal Logs
    .WriteTo.Logger(lc => lc
        .Filter.ByIncludingOnly(le => le.Level == LogEventLevel.Error || le.Level == LogEventLevel.Fatal)
        .WriteTo.File("Logs/errors-.txt",
            rollingInterval: RollingInterval.Day,
            retainedFileCountLimit: 10,
     outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {Message:lj}{NewLine}" +
                "Exception: {Exception:format=ToString}{NewLine}" +
                "Source: {SourceContext}{NewLine}" +
                "RequestId: {RequestId}{NewLine}" +
                "TraceId: {TraceId}{NewLine}" +
                "Properties: {Properties:j}{NewLine}" +
                "--------------------------------------------------------------------------------{NewLine}")

    )
    .CreateLogger();

var builder = WebApplication.CreateBuilder(args);

// Use Serilog as the logging provider
builder.Host.UseSerilog();

// Add services to the container.
builder.Services.AddControllers();

// Config Redis
builder.Services.AddSingleton<IConnectionMultiplexer>(c =>
    {
        var options = ConfigurationOptions.Parse(builder.Configuration.GetConnectionString("Redis"));
        return ConnectionMultiplexer.Connect(options);
    });





// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAutoMapper(typeof(MappingProfiles));


builder.Services.AddDbContext<StoreContext>(options =>
{

    options.UseSqlServer(builder.Configuration.GetConnectionString("StoreConnection"));

});


// Add other services and controllers


builder.Services.AddApplicationServices();


//Config Identity
builder.Services.AddIdentityServices(builder.Configuration);



builder.Services.AddSwaggerDocumentation();


builder.Services.AddCors(option =>
{
    option.AddPolicy("CorsPolicy", builder =>
                   builder.AllowAnyOrigin().
                    AllowAnyMethod().
                    AllowAnyHeader());

});



builder.Services.AddScoped<PaymentIntentService>();


var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();
app.UseStatusCodePagesWithReExecute("/errors/{0}");



// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseMiddleware<ExceptionMiddleware>();
}


app.UseHttpsRedirection();

app.UseStaticFiles(); // to accese from Api to file content


app.UseStaticFiles(new StaticFileOptions
{
    // Set the physical file provider for static files
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "Content")
    ),

    // Set the URL path for accessing to images file
    RequestPath = "/content"
});
// after that go the appseting.developemnt.json update the ApiUrl to add /Content to url




app.UseSwaggerApplication();

app.UseCors("CorsPolicy");

app.UseAuthentication();
app.UseAuthorization();


app.MapControllers();
app.MapFallbackToAreaController("Index", "Fallback", "Index"); //  "Index" is the action name




app.Run();
