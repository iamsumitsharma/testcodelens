import React, { FunctionComponent } from "react";
import { ConnectWallet } from "../buttons/ConnectWallet";
import { LensAuth } from "../lens/LensAuth";

export const Header: FunctionComponent = (): JSX.Element => {

    return (
        <div className="w-full inline-flex p-5 bg-transparent absolute z-30">
            <div className="absolute right-6 top-8">
                <ConnectWallet />
            </div>
            <div className="absolute right-48">
                <LensAuth />
            </div>
        </div>
    )
}