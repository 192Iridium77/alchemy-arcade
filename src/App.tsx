import * as React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navigation from "./components/Navigation";
import Dashboard from "./pages/Dashboard";
import Game from "./pages/Game";

import { Box, Container } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

import { ThemeProvider } from "@mui/material/styles";
import { baseTheme } from "./themes";

export default function App() {
  return (
    <ThemeProvider theme={baseTheme}>
      <Box sx={{ display: "flex", height: "100%" }}>
        <CssBaseline />
        <Navigation />
        <Container sx={{ paddingTop: 8, height: "100%" }}>
          <Routes>
            <Route
              path="/"
              element={<Navigate to="/dashboard" replace={true} />}
            />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/game/:gameId" element={<Game />} />
          </Routes>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
