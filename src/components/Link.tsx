import NextLink from "next/link";

type LinkProps = {
  href: string;
  children: any;
  passHref?: boolean;
};

function Link({ href, children, ...props }: LinkProps) {
  return (
    <NextLink href={href}>
      <a {...props}>{children}</a>
    </NextLink>
  );
}

export { Link };
