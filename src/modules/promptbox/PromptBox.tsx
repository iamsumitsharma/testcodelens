import React from "react";
import { LensPost } from "./components/LensPost";
import { useLensPost } from "./hooks/useLensPost";

export const PromptBox = (): JSX.Element => {

  const {handlePostData} = useLensPost();

  return (
    <div className="w-[45%] h-[80%] fixed bg-gradient-to-r from-grad1 via-grad2 via-grad3 to-grad4 z-30 absolute rounded-lg top-[10%] left-[27.5%] shadow-2xl shadow-black	">
      <LensPost handlePostData={handlePostData} />
    </div>
  );
};
