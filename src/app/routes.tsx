import { createBrowserRouter } from "react-router";
import { Layout } from "./layout";
import { Dashboard } from "./pages/Dashboard";
import { WalletActivity } from "./pages/WalletActivity";
import { TokenFlow } from "./pages/TokenFlow";
import { NetworkHealth } from "./pages/NetworkHealth";
import { Notifications } from "./pages/Notifications";
import { Profile } from "./pages/Placeholders";

const basename = import.meta.env.BASE_URL;

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true,                   Component: Dashboard      },
      { path: "wallet",                Component: WalletActivity },
      { path: "token-flow",            Component: TokenFlow      },
      { path: "network",               Component: NetworkHealth  },
      { path: "notifications",         Component: Notifications  },
      { path: "insights",              Component: Notifications  },
      { path: "profile",               Component: Profile        },
    ],
  },
], { basename });
