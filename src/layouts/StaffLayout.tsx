// /src/layouts/StaffLayout.tsx
// ❌ Código temporalmente desactivado para evitar errores
//import { Navigate, Outlet } from "react-router-dom";
//import { useStaffAuth } from "@/contexts/useStaffAuth";
//import SidebarStaff from "@/components/staff/SidebarStaff"; // Pendiente de crear

//export default function StaffLayout() {
 // const { staff, loading } = useStaffAuth();

 // if (loading) return <p>Cargando...</p>;

 // if (!staff || staff.role !== "staff") {
 //   return <Navigate to="/staff/login" replace />;
 // }

 // return (
 //   <div className="flex min-h-screen">
 //     <SidebarStaff />
 //     <main className="flex-1 p-4 bg-gray-100">
 //       <Outlet />
  //    </main>
//    </div>
 // );
//}

export default function StaffLayout() {
  return <></>; // Temporalmente vacío para no romper la compilación
}
