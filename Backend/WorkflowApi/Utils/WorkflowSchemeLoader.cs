using OptimaJet.Workflow.Core.Entities;
using System.Text;
using System.Xml.Linq;

namespace WorkflowApi.Utils
{
    public class WorkflowSchemeLoader
    {
        public static async Task EnsureSchemeIsUpToDateAsync(string schemeCode, string xmlPath)
        {
            if (!File.Exists(xmlPath))
            {
                Console.WriteLine($"[Workflow] Scheme XML not found at {xmlPath}");
                return;
            }

            var xmlText = await File.ReadAllTextAsync(xmlPath, Encoding.UTF8);
            var xElement = XElement.Parse(xmlText); // Validate XML

            await using var conn = WorkflowLib.WorkflowInit.Provider.OpenConnection();

            // Load the current scheme
            var existingScheme = await WorkflowLib.WorkflowInit.Provider.WorkflowScheme
                .SelectByKeyAsync(conn, schemeCode);

            if (existingScheme == null || (existingScheme.Scheme?.Trim() != xmlText.Trim()))
            {
                Console.WriteLine($"[Workflow] Adding or updating scheme: {schemeCode}");

                var scheme = new SchemeEntity
                {
                    Code = schemeCode,
                    Scheme = xmlText,
                    Tags = "", // Optional
                    CanBeInlined = false,
                    InlinedSchemes = null
                };

                if (existingScheme == null)
                {
                    await WorkflowLib.WorkflowInit.Provider.WorkflowScheme.InsertAsync(conn, scheme);
                }
                else
                {
                    await WorkflowLib.WorkflowInit.Provider.WorkflowScheme.UpdateAsync(conn, scheme);
                }
            }
            else
            {
                Console.WriteLine($"[Workflow] Scheme '{schemeCode}' is already up to date.");
            }
        }
    }
}

