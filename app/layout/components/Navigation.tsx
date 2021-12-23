import {
  Avatar,
  Button,
  ButtonGroup,
  ChakraProps,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Text,
  Wrap,
  WrapItem
} from "@chakra-ui/react"
import useHasPermission from "app/auth/hooks/useHasPermission"
import logout from "app/auth/mutations/logout"
import Link from "app/core/components/Link"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { Routes, useMutation } from "blitz"
import { forwardRef, Suspense } from "react"
import { FaCogs, FaSignOutAlt, FaUsers, FaUsersCog } from "react-icons/fa"

const MenuLink = (props: {
  href: string,
  icon: JSX.Element,
  children: React.ReactNode,
} & ChakraProps) => {
  const {href, icon, ...otherProps} = props;

  return (
    <MenuItem
      as={Link}
      href={props.href}
      icon={icon}
      _focus={{
        boxShadow: "none",
      }}

      {...otherProps}
    />
  );
};

const UserInfo = () => {
  const currentUser = useCurrentUser()
  const [logoutMutation] = useMutation(logout);
  const administrationView = useHasPermission("admin.view");

  if (currentUser && currentUser !== null) {
    return (
      <Menu>
        <MenuButton>
          <Wrap alignItems="center">
            <WrapItem alignItems="center">
              <Avatar name={currentUser.name} />
            </WrapItem>
            <WrapItem alignItems="center">
              <Text fontWeight="bold">{currentUser.name}</Text>
            </WrapItem>
          </Wrap>
        </MenuButton>
        <MenuList>
          <MenuLink icon={<FaCogs size={16} />} href="/settings">Settings</MenuLink>
          <MenuDivider />
          {administrationView && <MenuGroup title="Administration">
            <MenuLink icon={<FaUsersCog size={16} />} href="/groups">Groups</MenuLink>
            <MenuLink icon={<FaUsers size={16} />} href="/users">Users</MenuLink>
          </MenuGroup>}
          <MenuDivider />
          <MenuItem
            icon={<FaSignOutAlt size={16} />}
            onClick={async () => await logoutMutation()}
          >
            Logout
          </MenuItem>
        </MenuList>
      </Menu>
    );
  } else {
    return (
      <ButtonGroup>
        <Button as={Link} href={Routes.LoginPage()} colorScheme="teal" variant="solid">Login</Button>
        <Button as={Link} href={Routes.SignupPage()} colorScheme="teal" variant="outline">Sign up</Button>
      </ButtonGroup>
    );
  }
}

const Navigation = () => {
  return (
    <Flex
      as="nav"
      py={3}
      px={2}
      justifyContent="space-between"
    >
      <Heading as="h1" size="lg">
        Blitz-Forums
      </Heading>
      <Suspense fallback="Loading ...">
        <UserInfo />
      </Suspense>
    </Flex>
  )
}

export default Navigation
