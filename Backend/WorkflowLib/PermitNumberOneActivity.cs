using System.Net;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using OptimaJet.Workflow.Core;
using OptimaJet.Workflow.Core.Model;
using OptimaJet.Workflow.Core.Runtime;

namespace WorkflowLib;

public sealed class PermitNumberOneActivity : ActivityBase
{
    public PermitNumberOneActivity()
    {
        Type = "PermitNumberOneActivity";
        Title = "DDOT Permit One";
        Description = "Permit Number One - Test";

        // the file name with your form template, without extension
        Template = "permitNumberOneActivity";
        // the file name with your svg template, without extension
        SVGTemplate = "permitNumberOneActivity";
    }

    public override async Task ExecutionAsync(WorkflowRuntime runtime, ProcessInstance processInstance,
        Dictionary<string, string> parameters, CancellationToken token)
    {
        await processInstance.SetParameterAsync("PermitOneStatus", "Testing", ParameterPurpose.Persistence);
    }

    public override async Task PreExecutionAsync(WorkflowRuntime runtime, ProcessInstance processInstance,
        Dictionary<string, string> parameters, CancellationToken token)
    {
        // do nothing
    }
}