import Link, { LinkProps } from "next/link";
import { ReactElement, cloneElement } from "react";
//disponibiliza acesso a informações sobre as rotas
import { useRouter } from "next/router";

interface IProps extends LinkProps {
  children: ReactElement;
  activeClass: string;
}

export function ActiveLink({ children, activeClass, ...rest }: IProps) {
  //as path 'informa' a rota que está ativa no momento
  const { asPath } = useRouter();

  const className = rest.href === asPath ? activeClass : "";

  return <Link {...rest}>{cloneElement(children, { className })}</Link>;
}
