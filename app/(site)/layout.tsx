import { NavbarServer } from "@/components/navigation/navbar-server";
import { Region } from "@prisma/client";
import TopNavbar from "@/components/pages/common/topnavbar";
export const dynamic = "force-dynamic";

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
