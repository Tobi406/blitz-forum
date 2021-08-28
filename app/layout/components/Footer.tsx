import { Flex } from "@chakra-ui/react"
import Link from "app/core/components/Link"
import { Routes } from "blitz"
import { FaGithub } from "react-icons/fa"

const Footer = () => {
  return (
    <Flex
      as="footer"
      justifyContent="space-between"
      alignItems="center"
      px={3}
      py={5}
      marginTop="auto"
      bg="gray.100"
    >
      <Link href={Routes.Home()}>Home</Link>
      <Link href="#">
        <Flex alignItems="center">
          <FaGithub />
          &nbsp;GitHub
        </Flex>
      </Link>
    </Flex>
  )
}

export default Footer
