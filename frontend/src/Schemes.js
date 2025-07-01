import { Dropdown, Loader, Button, Input, Message } from "rsuite";
import { useEffect, useState } from "react";
import settings from "./settings";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const schemeNameMap = {
  permit_type_main_for_engine_1: "Construction",
  permit_type_main_for_engine_2: "Parking / Occupancy",
  permit_type_main_for_engine_3: "Commercial Vehicle",
  permit_type_main_for_engine_4: "Public Space Rental",
};

const Schemes = (props) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mainSchemes, setMainSchemes] = useState([]);
  const [selectedMain, setSelectedMain] = useState(null);
  const [newSchemeName, setNewSchemeName] = useState("");
  const [error, setError] = useState("");
  const [childSchemes, setChildSchemes] = useState([]);

  useEffect(() => {
    fetch(`${settings.workflowUrl}/schemes`)
      .then((response) => response.json())
      .then((schemes) => {
        setData(schemes);
        const mainOnly = schemes.filter(
          (s) =>
            s.code.startsWith("permit_type_main_for_engine") &&
            !s.code.includes("_child_")
        );
        setMainSchemes(mainOnly);

        const children = schemes.filter(
          (s) =>
            s.code.startsWith("permit_type_main_for_engine") &&
            s.code.includes("_child_")
        );
        setChildSchemes(children);

        setLoading(false);
      });
  }, []);

  const handleCloneScheme = async () => {
    const trimmed = newSchemeName.trim();

    if (!trimmed || /[^a-zA-Z0-9 _]/.test(trimmed)) {
      setError(
        "Name can only contain letters, numbers, spaces, and underscores."
      );
      return;
    }

    const sanitized = trimmed.replace(/\s+/g, "_");
    const newCode = `${selectedMain.code}_child_${sanitized}`;

    try {
      const existsRes = await fetch(
        `${settings.designerUrl}?schemecode=${newCode}&processid=&schemeid=&operation=exists`
      );
      const exists = await existsRes.text();
      if (exists === "true") {
        throw new Error("A scheme with this name already exists.");
      }

      const loadRes = await fetch(
        `${settings.designerUrl}?schemecode=${selectedMain.code}&processid=&schemeid=&operation=load`
      );
      if (!loadRes.ok) throw new Error("Failed to load original scheme");
      const originalScheme = await loadRes.json();

      const newScheme = JSON.parse(JSON.stringify(originalScheme));
      newScheme.Code = newCode;
      newScheme.Name = newCode;
      newScheme.Id = "00000000-0000-0000-0000-000000000000";

      const formData = new FormData();
      formData.append("schemecode", newCode);
      formData.append("processid", "");
      formData.append("schemeid", "");
      formData.append("operation", "save");
      formData.append("data", JSON.stringify(newScheme));

      const saveRes = await fetch(`${settings.designerUrl}`, {
        method: "POST",
        body: formData,
      });

      if (!saveRes.ok) throw new Error("Failed to save new scheme");

      props.onRowClick?.({ code: newCode });
    } catch (err) {
      setError(err.message || "Error occurred while creating the scheme");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <Loader size="md" content="Please wait, schemes are loading..." />
      </div>
    );
  }

  const groupedChildSchemes = mainSchemes.map((main) => ({
    mainCode: main.code,
    displayName: schemeNameMap[main.code] || main.code,
    children: childSchemes.filter((child) =>
      child.code.startsWith(main.code + "_child_")
    ),
  }));

  return (
    <div>
      <div style={{ margin: 50 }}>
        <h5>Select the main permit category:</h5>
        <Dropdown
          style={{ padding: 20, fontSize: 18, width: 300 }}
          title={schemeNameMap[selectedMain?.code] || "Select Main Scheme"}
        >
          {mainSchemes.map((main) => (
            <Dropdown.Item
              key={main.code}
              style={{ padding: 20, fontSize: 18 }}
              onClick={() => {
                setSelectedMain(main);
                setError("");
                setNewSchemeName("");
              }}
            >
              {schemeNameMap[main.code] || main.code}
            </Dropdown.Item>
          ))}
        </Dropdown>
      </div>

      {selectedMain && (
        <div style={{ margin: 50 }}>
          <h5>
            Create a Child Permit type with the above selected parent permit
            type:
          </h5>
          <Input
            placeholder="Enter new child scheme name"
            value={newSchemeName}
            onChange={(val) => {
              setNewSchemeName(val);
              setError("");
            }}
          />
          <div style={{ marginTop: 10 }}>
            <Message type="info" showIcon>
              Only letters, numbers, spaces, and underscores are allowed. Spaces
              will be converted to underscores.
            </Message>
          </div>
          {error && (
            <div style={{ marginTop: 10 }}>
              <Message type="error" showIcon>
                {error}
              </Message>
            </div>
          )}
          <Button
            appearance="primary"
            style={{ marginTop: 20 }}
            onClick={handleCloneScheme}
          >
            Create Sub Permit Category
          </Button>
        </div>
      )}

      <div style={{ margin: 50 }}>
        <h5>Existing Sub Permit Workflows:</h5>
        {groupedChildSchemes.length > 0 ? (
          groupedChildSchemes.map((group) => (
            <Accordion
              key={group.mainCode}
              defaultExpanded={false}
              sx={{ marginTop: 2 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <h6>{group.displayName}</h6>
              </AccordionSummary>
              <AccordionDetails>
                {group.children.length > 0 ? (
                  group.children.map((child) => {
                    const childName = child.code
                      .replace(group.mainCode + "_child_", "")
                      .replace(/_/g, " ");
                    return (
                      <Box
                        key={child.code}
                        onClick={() => props.onRowClick?.(child)}
                        sx={{
                          padding: "5px 0",
                          cursor: "pointer",
                          color: "#1675e0",
                        }}
                      >
                        <h7>
                          {group.displayName} - {childName}
                        </h7>
                      </Box>
                    );
                  })
                ) : (
                  <h7 sx={{ fontStyle: "italic" }}>No sub workflows.</h7>
                )}
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <Message type="info">No child schemes found.</Message>
        )}
      </div>
    </div>
  );
};

export default Schemes;
