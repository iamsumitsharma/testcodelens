import React, { FunctionComponent } from "react";
import { LensPostProps } from "../../../generated/lens/lenstypes.types";

export const LensPost: FunctionComponent<LensPostProps> = ({
  handlePostData,
}): JSX.Element => {

  return (
      <form
      onSubmit={handlePostData}
      >
        <button
     
          type="submit"
          className=" absolute p-2 rounded-b-lg text-distro text-white text-base bg-offBlack"
        >
          POST
        </button>
      </form>
  );
};
