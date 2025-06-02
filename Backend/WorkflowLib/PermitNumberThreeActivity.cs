using System.Net;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using OptimaJet.Workflow.Core;
using OptimaJet.Workflow.Core.Model;
using OptimaJet.Workflow.Core.Runtime;

namespace WorkflowLib;

public sealed class PermitNumberThreeActivity : ActivityBase
{
    public PermitNumberThreeActivity()
    {
        Type = "PermitNumberThreeActivity";
        Title = "DDOT Permit Three";
        Description = "Permit Number Three - Test";

        // the file name with your form template, without extension
        Template = "permitNumberThreeActivity";
        // the file name with your svg template, without extension
        SVGTemplate = "permitNumberThreeActivity";
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