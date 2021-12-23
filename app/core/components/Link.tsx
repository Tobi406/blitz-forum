import { ChakraProps, Link as ChakraLink } from "@chakra-ui/react"
import { Link as BlitzLink, RouteUrlObject } from "blitz"
import { ReactNode, forwardRef, LegacyRef } from "react"

const Link = forwardRef((props: { href: string | RouteUrlObject; children: ReactNode } & ChakraProps, ref) => {
  const { href, ...otherProps } = props;

  return (
    <BlitzLink
      href={href}
      passHref
    >
      <ChakraLink
        as="a"
        ref={ref as LegacyRef<HTMLAnchorElement>}

        {...otherProps}
      />
    </BlitzLink>
  );
});

export default Link
