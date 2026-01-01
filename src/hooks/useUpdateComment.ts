import {
  useMutation,
  type UseMutationResult,
} from "@tanstack/react-query";

import { axiosPrivateInstance } from "../services/api/apiInstance";
import { Admin } from "../services/api/apiConfig";
import type { AxiosError } from "axios";

interface IResponse {
      message: string,
}

// 1. Update the variables interface
interface UpdateCommentVariables {
  comment: string;
  id: string; // make it required, or keep nullable if needed
}

// 2. Keep your API function (small fix: handle null id properly)
export const updateFacility = async (
  { comment, id }: UpdateCommentVariables
): Promise<IResponse> => {
  if (!id) {
    throw new Error("Facility ID is required to update");
  }

  const res = await axiosPrivateInstance.patch<IResponse>(
    Admin.updateComment(id),
    { comment } // only send comment in body
  );

  return res.data;
};

// 3. Correct mutation hook
export const useUpdateComment = (): UseMutationResult<
  IResponse,
  AxiosError<{ message: string }>,
  UpdateCommentVariables
> => {
  return useMutation({
    mutationFn: updateFacility, // now receives { comment, id }
  });
};