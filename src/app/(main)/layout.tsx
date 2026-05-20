import Header from "@/components/header/header";
import { getUser } from "@/lib/dal";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  const navigation = [
    { name: 'For Athletes', href: '#' },
    { name: 'For Brands', href: '#' },
  ]

  return (
    <>
      <Header navigation={navigation} user={user} showSignOut={!!user} />
      {children}
    </>
  );
}
