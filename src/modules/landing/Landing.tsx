import React, { FunctionComponent } from "react";
import { PromptBox } from "../promptbox/PromptBox";

export const Landing: FunctionComponent = (): JSX.Element => {
    return (
        <div className="flex text-center relative w-full min-h-screen">
            <PromptBox />
        </div>
    )
}