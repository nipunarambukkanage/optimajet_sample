import { Button, ButtonGroup } from "rsuite";
import React from "react";

const schemeNameMap = {
  permit_type_main_for_engine_1: "Construction",
  permit_type_main_for_engine_2: "Parking / Occupancy",
  permit_type_main_for_engine_3: "Commercial Vehicle",
  permit_type_main_for_engine_4: "Public Space Rental",
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
