import { PostArgsType, postContentType, useLensPostResult } from "./../../../generated/lens/lenstypes.types";
import {
  useAccount,
  usePrepareContractWrite,
  useSignTypedData,
  useContractWrite,
} from "wagmi";
import LensHubProxy from "./../../../abis/LensHubProxy.json";
import { LENS_HUB_PROXY_ADDRESS_MUMBAI } from "../../../lib/lens/constants";
import { splitSignature, omit } from "../../../lib/lens/helpers";
import createPostTypedData from "../../../graphql/mutations/createPost";
import getDefaultProfile from "../../../graphql/queries/userProfile";
import checkIndexed from "../../../graphql/queries/indexer";
import { useState } from "react";

export const useLensPost = (): useLensPostResult => {
  const [args, setArgs] = useState<PostArgsType | undefined>();
  const [showPostButton, setShowPostButton] = useState<boolean>(false);
  const [enabled, setEnabled] = useState<boolean>(false);
  const { signTypedDataAsync } = useSignTypedData();
  const { address } = useAccount();
  
  const { config } = usePrepareContractWrite({
    addressOrName: LENS_HUB_PROXY_ADDRESS_MUMBAI,
    contractInterface: LensHubProxy,
    functionName: "postWithSig",
    onError(error) {
      console.error('Error', error)
    },
    onSettled(error) {
      console.log('Settled', error)
    },
    onSuccess(error) {
      console.log('Success', error)
    },
    enabled: Boolean(enabled),
    args: [args]
  });

  const { writeAsync } = useContractWrite(config);

  const handlePostData = async (e: any): Promise<void> => {
    e.preventDefault();

    let postContent: postContentType = {
      prompt: e.target.prompt.value,
      description: e.target.description.value,
      files: [e.target.post.files[0], e.target.post.files[1], e.target.post.files[2]]
    }
    console.log(postContent)

    try {

      const profile = await getDefaultProfile(address);

      const result = await createPostTypedData({
        profileId: profile.data.defaultProfile.id,
        contentURI: "ipfs://bafkreigdvytd54m663k6cr5jxl7swy4awhtze4ebg27ps57dra6c7q3n44",
        collectModule: {
          revertCollectModule: true,
        },
        referenceModule: {
          followerOnlyReferenceModule: false,
        },
      });

      const typedData = result.data.createPostTypedData.typedData;

      const signature = await signTypedDataAsync({
        domain: omit(typedData?.domain, "__typename"),
        types: omit(typedData?.types, "__typename"),
        value: omit(typedData?.value, "__typename"),
      });

      const { v, r, s } = splitSignature(signature);

      const postArgs: PostArgsType = {
        profileId: typedData.value.profileId,
        contentURI: typedData.value.contentURI,
        collectModule: typedData.value.collectModule,
        collectModuleInitData: typedData.value.collectModuleInitData,
        referenceModule: typedData.value.referenceModule,
        referenceModuleInitData: typedData.value.referenceModuleInitData,
        sig: {
          v,
          r,
          s,
          deadline: typedData.value.deadline,
        },
      };

      setArgs(postArgs);
      setShowPostButton(true);
      setEnabled(true);

    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handlePostWrite = async (): Promise<void> => {
    const tx = await writeAsync?.()
    const res = await tx?.wait()

    setTimeout( async () => {
      const result = await checkIndexed(tx?.hash)
      console.log(result)
    }, 10000)
  }

  const handleFileChange = (e: any): void => {
    e.preventDefault();

  };

  const handleHashImages = (e: any): void => {
    e.preventDefault();

  };
  
  

  return { handlePostWrite, handlePostData, handleHashImages, handleFileChange, showPostButton };
};
