"use client";

import PageNav from "./PageNav";

export default function Navbar() {
  return (
    <PageNav
      titleHref="/dashReport"
      buttons={[
        { label: "Dashboard", href: "/dashReport" },
        { label: "Add Table", href: "/addTable" },
      ]}
      showLogout
    />
  );
}
