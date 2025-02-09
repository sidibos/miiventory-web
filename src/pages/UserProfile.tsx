import { useParams } from "react-router-dom";
import {Header } from "@/components/layout/Header";
import { UserProfile } from "@/components/users/UserProfile";


const UserProfilePage = () => {
    let params = useParams();

    return (
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <h2 className="mb-6 text-2xl font-semibold text-gray-900">Users</h2>
            <UserProfile email={params.email} />
          </main>
        </div>
      );
}

export default UserProfilePage;