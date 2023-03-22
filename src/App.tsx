import * as React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

import { TopBar } from "./components/Navigation";
import ScratchList from "./pages/Scratch/List";
import ScratchGame from "./pages/Scratch/Game";
import SnesList from "./pages/Snes/List";
import SnesGame from "./pages/Snes/Game";

import { Container } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { baseTheme } from "./themes";
import MenuItems from "./components/MenuItems";
import styled from "styled-components";
import { md, Mobile } from "./components/responsive";

const TopBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export default function App() {
  return (
    <ThemeProvider theme={baseTheme}>
      <TopBarContainer>
        <TopBar
          leftMenu={
            useMediaQuery({ query: md.toString() }) ? <MenuItems /> : null
          }
        />
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
      </TopBarContainer>
    </ThemeProvider>
  );
}
