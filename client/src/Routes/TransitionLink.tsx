import React, { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";

interface TransitionLinkProps {
  children: ReactNode;
  to: string; // React Router uses 'to' instead of 'href'
  data?: any;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const TransitionLink: React.FC<TransitionLinkProps> = ({ to, children, data }) => {
  const navigate = useNavigate();

  const handleTransition = async (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();

    const body = document.querySelector("body");
    body?.classList.add("page-transition");

    await sleep(200);
    navigate(to, { state: { data } });; // Navigate to the target route
    await sleep(200);
     // Scroll to the top of the next page
     window.scrollTo(0, 0);

    body?.classList.remove("page-transition");
  };

  return (
    <Link to={to} onClick={handleTransition} state={{ value:data }}>
      {children}
    </Link>
  );
};
