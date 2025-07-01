import { Loader, Table } from "rsuite";
import { useEffect, useState } from "react";
import settings from "./settings";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const schemeNameMap = {
  permit_type_main_for_engine_1: "Construction",
  permit_type_main_for_engine_2: "Parking / Occupancy",
  permit_type_main_for_engine_3: "Commercial Vehicle",
  permit_type_main_for_engine_4: "Public Space Rental",
};

const Processes = (props) => {
  const [data, setData] = useState([]);
  const [grouped, setGrouped] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${settings.workflowUrl}/instances`)
      .then((response) => response.json())
      .then((processes) => {
        const filteredProcesses = processes.filter((p) => {
          const main = p.scheme.split("_child_")[0];
          return Object.keys(schemeNameMap).includes(main);
        });

        const groupedMap = {};
        filteredProcesses.forEach((p) => {
          const mainScheme = p.scheme.split("_child_")[0];
          if (!groupedMap[mainScheme]) groupedMap[mainScheme] = [];
          groupedMap[mainScheme].push(p);
        });

        const groupedArray = Object.entries(groupedMap).map(
          ([main, children]) => ({
            mainScheme: main,
            displayName: schemeNameMap[main] || main,
            children,
          })
        );
        setGrouped(groupedArray);
        setData(filteredProcesses);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" mt={5}>
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Loader size="md" content="Please wait, processes are loading..." />
        </div>
      </Box>
    );
  }

  return (
    <div style={{ margin: 40 }}>
      {grouped.map((group) => (
        <Accordion key={group.mainScheme} defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">{group.displayName}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer component={Paper}>
              <MuiTable size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Id</TableCell>
                    <TableCell>Scheme</TableCell>
                    <TableCell>Creation Date</TableCell>
                    <TableCell>State</TableCell>
                    <TableCell>Activity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {group.children.map((row) => {
                    const readableChildName = row.scheme
                      .replace(group.mainScheme + "_child_", "")
                      .replace(/_/g, " ");
                    return (
                      <TableRow
                        key={row.id}
                        hover
                        sx={{ cursor: "pointer" }}
                        onClick={() => props.onRowClick?.(row)}
                      >
                        <TableCell>{row.id}</TableCell>
                        <TableCell>
                          {group.displayName} - {readableChildName}
                        </TableCell>
                        <TableCell>{row.creationDate}</TableCell>
                        <TableCell>{row.stateName}</TableCell>
                        <TableCell>{row.activityName}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </MuiTable>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default Processes;
