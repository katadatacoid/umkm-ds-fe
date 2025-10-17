import React from "react";
import DashboardUserLayout from "@/app/ui/layout/ds-user-layout"; // Import DashboardLayout

const AffiliateManagement: React.FC = () => {
  return (
    <DashboardUserLayout path="user">
      {/* Custom content for this page */}
      <p>Affiliate</p>
      <div>
        <p>Here, you can add any additional components or UI elements for this page.</p>
      </div>
    </DashboardUserLayout>
  );
};

export default AffiliateManagement;
