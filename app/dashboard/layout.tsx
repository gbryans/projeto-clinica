import SidebarMenu from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Aqui você chama o componente que criou */}
      <aside className="fixed top-4 left-4 z-50">
        <SidebarMenu />
      </aside>

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}