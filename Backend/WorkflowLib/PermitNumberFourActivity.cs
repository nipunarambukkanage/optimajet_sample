using System.Net;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using OptimaJet.Workflow.Core;
using OptimaJet.Workflow.Core.Model;
using OptimaJet.Workflow.Core.Runtime;

namespace WorkflowLib;

public sealed class PermitNumberFourActivity : ActivityBase
{
    public PermitNumberFourActivity()
    {
        Type = "PermitNumberFourActivity";
        Title = "DDOT Permit Four";
        Description = "Permit Number Four - Test";

        // the file name with your form template, without extension
        Template = "permitNumberFourActivity";
        // the file name with your svg template, without extension
        SVGTemplate = "permitNumberFourActivity";
    }

    public override async Task ExecutionAsync(WorkflowRuntime runtime, ProcessInstance processInstance,
        Dictionary<string, string> parameters, CancellationToken token)
    {
        await processInstance.SetParameterAsync("PermitTwoStatus", "Reviewed", ParameterPurpose.Persistence);
    }

    public override async Task PreExecutionAsync(WorkflowRuntime runtime, ProcessInstance processInstance,
        Dictionary<string, string> parameters, CancellationToken token)
    {
        // do nothing
    }
}