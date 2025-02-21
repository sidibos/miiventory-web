
import { Auth0Provider } from "@auth0/auth0-react";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Auth0Provider
      domain="miinventory-dev.uk.auth0.com"
      clientId="QCVvbcnCc5ugy39VrRgHeRyxIMZisWyv"
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
      {children}
    </Auth0Provider>
  );
};