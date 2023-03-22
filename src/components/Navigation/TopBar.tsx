import { useState } from "react";
import styled from "styled-components";
import { Popover } from "react-tiny-popover";
import { ReactNode } from "react";
import Icon from "../Icon";

interface MobileTopBarProps {
  leftMenu?: ReactNode;
  rightMenu?: ReactNode;
}

const StyledTopbarContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 56px;

  z-index: 1;
  position: relative;
`;

const StyledLogoContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledPopoverContainer = styled.div`
  display: flex;
  height: 56px;
  align-items: center;

  margin-left: 16px;
`;

/**
 *  logo in top center
 *  slot at top right for things like login/logouts
 *  use separate component for navigation
 */
export default function TopBar({ leftMenu, rightMenu }: MobileTopBarProps) {
  const [isLeftMenuOpen, setIsLeftMenuOpen] = useState(false);

  return (
    <StyledTopbarContainer className="dropshadow-bottom-md">
      <StyledPopoverContainer>
        {leftMenu ? (
          <Popover
            isOpen={isLeftMenuOpen}
            positions={["bottom"]}
            content={({ position, childRect, popoverRect }) => (
              <div onClick={() => setIsLeftMenuOpen(!isLeftMenuOpen)}>
                {leftMenu}
              </div>
            )}
          >
            <div>
              <Icon
                type="Menu"
                onClick={() => setIsLeftMenuOpen(!isLeftMenuOpen)}
              />
            </div>
          </Popover>
        ) : null}
      </StyledPopoverContainer>
      <StyledLogoContainer>
        <img src="/ArcadeLogo.png" width={50} alt="Logo" />
      </StyledLogoContainer>
      <div>{/* <Popover isOpen={isRightMenuOpen}>{rightMenu}</Popover> */}</div>
    </StyledTopbarContainer>
  );
}
