import * as React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navigation from "./components/Navigation";
import ScratchList from "./pages/Scratch/List";
import ScratchGame from "./pages/Scratch/Game";
import SnesList from "./pages/Snes/List";
import SnesGame from "./pages/Snes/Game";

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
              element={<Navigate to="/scratch" replace={true} />}
            />
            <Route path="/scratch" element={<ScratchList />} />
            <Route path="/scratch/game/:gameId" element={<ScratchGame />} />
            <Route path="/snes" element={<SnesList />} />
            <Route path="/snes/game/:gameId" element={<SnesGame />} />
          </Routes>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
