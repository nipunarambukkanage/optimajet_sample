import { Button, ButtonGroup } from "rsuite";
import React from "react";

const schemeNameMap = {
  commercial_vehicle_1: "Commercial Vehicle",
};

const SchemeMenu = (props) => {
  const onClick = () => {
    const newCode = prompt("Enter scheme name");
    if (newCode) {
      props.onNewScheme?.(newCode);
    }
  };

  const getFormattedName = (code) => {
    if (!code) return "";
    const [mainPart, suffixPart] = code.split("_child_");
    const mainName = schemeNameMap[mainPart] || mainPart;
    const suffix = suffixPart ? suffixPart.replace(/_/g, " ") : "";
    return suffix ? `${mainName} - ${suffix}` : mainName;
  };

  return (
    <ButtonGroup>
      <Button disabled={true}>
        Scheme: {getFormattedName(props.schemeCode)}
      </Button>
      {/* <Button onClick={onClick}>Create or load scheme</Button> */}
      <Button onClick={() => props.onCreateProcess?.()}>Create process</Button>
    </ButtonGroup>
  );
};

export default SchemeMenu;
