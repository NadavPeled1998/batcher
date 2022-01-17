import { observer } from "mobx-react-lite";
import React from "react";
import { useMoralis } from "react-moralis";

export type Condition = "connected" | "notConnected";
export type Behavior = "hide" | "disable";

export interface PermissableProps {
  condition?: Condition;
  behavior?: Behavior;
  children: React.ReactNode;
}

const addDisabledAttr = (children: React.ReactNode) => {
  return React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { disabled: true });
    }
    return child;
  });
};

export const Permissable = observer(
  ({
    condition = "connected",
    behavior = "hide",
    children,
  }: PermissableProps) => {
    const { isAuthenticated } = useMoralis();

    const connected = {
      connected: isAuthenticated,
      notConnected: !isAuthenticated,
    };

    if (connected[condition]) return <>{children}</>;
    if (behavior === "disable") return <>{addDisabledAttr(children)}</>;
    return null;
  }
);
