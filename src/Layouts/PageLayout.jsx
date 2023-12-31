import { Box, Flex, Spinner } from "@chakra-ui/react";
import Sidebar from "../components/Sidebar/Sidebar";
import { useLocation } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebase";
import Navbar from "../components/Navbar/Nabvar";

const PageLayout = ({ children }) => {
  const { pathname } = useLocation();
  const [user, loading] = useAuthState(auth);
  const canRenderSidebar = pathname !== "/auth" && user;
  const canRenderNavbar = !user && !loading && pathname !== "/auth";
  
  const chekingUserIsAuth = !user && loading 
  if (chekingUserIsAuth) return <PageLayoutSpinner />

  return (
    <Flex flexDir={canRenderNavbar ? "column" : "row"}>
      {/* sidebar on the left */}
      { canRenderSidebar ? (
        <Box w={{ base: "70px", md: "240px" }}>
          <Sidebar />
        </Box>
      ) : null}
      {/*  Navbar  */}
      {canRenderNavbar ? <Navbar /> : null}
      {/* the page content on the right */}
      <Box flex={1} w={{base:"cal(100% - 70px)",md:"cal(100% - 240px)"}} >
        {children}
        </Box>
    </Flex>
  );
};

export default PageLayout;

const PageLayoutSpinner = () => {
  return (
    <Flex flexDir={"column"} h={"100vh"} alignItems={"center"} justifyContent={"center"}>
      <Spinner size={"xl"} />
    </Flex>
  )
}