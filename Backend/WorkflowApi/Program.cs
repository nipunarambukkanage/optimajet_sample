using WorkflowApi.Utils; // Make sure this is included at the top

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

const string rule = "MyCorsRule";
builder.Services.AddCors(options =>
{
    options.AddPolicy(rule, policy => policy.AllowAnyOrigin());
});

var app = builder.Build();

// ✅ Load and sync XML scheme BEFORE running the app
await WorkflowSchemeLoader.EnsureSchemeIsUpToDateAsync(
    "permit_approval_process_2",
    Path.Combine(app.Environment.ContentRootPath, "Schemes", "permit_approval_process_2.xml")
);

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseCors(rule);
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
