import DashboardHeader from '@/components/header/dashboard-header'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DashboardHeader />
      {children}
    </>
  )
}
