import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const StyledMenuItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 16px;
  background-color: white;
`;

export default function MenuItems({ className }: any) {
  const navigate = useNavigate();

  const navigateToScratchList = () => {
    navigate("/scratch");
  };

  const navigateToSnesList = () => {
    navigate("/snes");
  };

  return (
    <StyledMenuItemsContainer className={className}>
      <button onClick={navigateToScratchList} style={{ marginTop: "12px" }}>
        <img src="/scratchLogo.png" style={{ width: 40 }} alt="Scratch Logo" />
      </button>
      <button onClick={navigateToSnesList} style={{ marginTop: "12px" }}>
        <img
          src="/snes.webp"
          style={{ width: 40, height: 40 }}
          alt="Snes Icon"
        />
      </button>
    </StyledMenuItemsContainer>
  );
}
