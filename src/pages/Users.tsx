import { Header } from "@/components/layout/Header";
import { UserList } from "@/components/users/UserList";

const Users = () => {
    return (
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <h2 className="mb-6 text-2xl font-semibold text-gray-900">Users</h2>
            <UserList />
          </main>
        </div>
      );
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header />
//       <main className="container mx-auto px-4 py-8">
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
//           <UserList />
//         </div>
//       </main>
//     </div>
//   );
};

export default Users;