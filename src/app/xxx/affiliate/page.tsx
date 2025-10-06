import React from "react";
import DashboardAdminLayout from "@/app/ui/layout/ds-admin-layout"; // Import DashboardLayout

const AffiliateManagement: React.FC = () => {
  return (
    <DashboardAdminLayout
        path="xxx"
    >
      {/* Custom content for this page */}
      <p>Management AffiliateManagement</p>
      <div>
        <p>Here, you can add any additional components or UI elements for this page.</p>
      </div>
    </DashboardAdminLayout>
  );
};

export default AffiliateManagement;
