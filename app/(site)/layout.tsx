import { NavbarServer } from "@/components/navigation/navbar-server";
import { Region } from "@prisma/client";
import TopNavbar from "@/components/pages/common/topnavbar";
export const revalidate = 86400;

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopNavbar />
      <NavbarServer region={Region.INDIA} />
      {children}
    </>
  );
}
