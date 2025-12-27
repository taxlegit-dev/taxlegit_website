import { NavbarServer } from "@/components/navigation/navbar-server";
import { Region } from "@prisma/client";

export const dynamic = "force-dynamic";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavbarServer region={Region.INDIA} />
      {children}
    </>
  );
}
