import { createContext , useState} from "react";
import { MolstarRibxz } from "../mstar/molstar_wrapper_class";

export const MolstarContext = createContext<null | MolstarRibxz>(null);

export default function MolstarContextProvider({ children, value }:{children:React.ReactNode, value: null | MolstarRibxz}) {
//   const [ctx, setCtx] = useState<null | MolstarRibxz>(null);

  return (
    <MolstarContext.Provider value={value}>
      {children}
    </MolstarContext.Provider>
  );
}