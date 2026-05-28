import Header from "@/components/header/header";
import { getUser } from "@/lib/dal";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  const navigation = [
    { name: 'Campaigns', href: '/campaigns' },
    {
      name: 'Explore',
      children: [
        { name: 'Athletes', href: '/explore/athletes' },
        { name: 'Brands', href: '/explore/brands' },
      ],
    },
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
