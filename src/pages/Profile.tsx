import React from "react";
import { UserDashboard } from "../components/features/user/UserDashboard";
import Breadcrumb from "../components/common/Breadcrumb";

const Profile: React.FC = () => {
  return (
    <main className="px-4 py-8">
      <Breadcrumb />
      <UserDashboard />
    </main>
  );
};

export default Profile;
