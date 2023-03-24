import { useMediaQuery } from "react-responsive";

const md = 767;
const lg = 991;

const Desktop = ({ children }: any) => {
  const isDesktop = useMediaQuery({ minWidth: lg + 1 });
  return isDesktop ? children : null;
};
const Tablet = ({ children }: any) => {
  const isTablet = useMediaQuery({ minWidth: md + 1, maxWidth: lg });
  return isTablet ? children : null;
};
const Mobile = ({ children }: any) => {
  const isMobile = useMediaQuery({ maxWidth: md });
  return isMobile ? children : null;
};
const Default = ({ children }: any) => {
  const isNotMobile = useMediaQuery({ minWidth: md + 1 });
  return isNotMobile ? children : null;
};

export { Desktop, Tablet, Mobile, Default, md, lg };
