import { ChakraProps, Link as ChakraLink } from "@chakra-ui/react"
import { Link as BlitzLink, RouteUrlObject } from "blitz"
import { ReactNode } from "react"

const Link = (props: { href: string | RouteUrlObject; children: ReactNode } & ChakraProps) => {
  const { href, ...otherProps } = props

  return (
    <BlitzLink href={href} passHref>
      <ChakraLink as="a" {...otherProps} />
    </BlitzLink>
  )
}

export default Link
