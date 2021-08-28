import { FaSignOutAlt, FaCogs } from "react-icons/fa"
import {
  Avatar,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  Wrap,
  WrapItem,
} from "@chakra-ui/react"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { Suspense } from "react"

const UserInfo = () => {
  const currentUser = useCurrentUser()

  return (
    <>
      {currentUser && (
        <Menu>
          <MenuButton>
            <Wrap alignItems="center">
              <WrapItem alignItems="center">
                <Avatar name={currentUser.name || "User"} />
              </WrapItem>
              <WrapItem alignItems="center">
                <Text fontWeight="bold">{currentUser.name || "User"}</Text>
              </WrapItem>
            </Wrap>
          </MenuButton>
          <MenuList>
            <MenuItem icon={<FaCogs size={16} />}>Settings</MenuItem>
            <MenuDivider />
            <MenuItem icon={<FaSignOutAlt size={16} />}>Logout</MenuItem>
          </MenuList>
        </Menu>
      )}
    </>
  )
}

const Navigation = () => {
  return (
    <Flex as="nav" py={3} px={2} justifyContent="space-between">
      <Heading as="h1" size="lg">
        Blitz-Forum
      </Heading>
      <Suspense fallback="Loading ...">
        <UserInfo />
      </Suspense>
    </Flex>
  )
}

export default Navigation
