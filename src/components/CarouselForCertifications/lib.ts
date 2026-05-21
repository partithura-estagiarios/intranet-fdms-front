import { server_express_url } from "../CardOfInstitutional/lib";
import { useImgs } from "../../stores/imgs";
import type { ActionResult } from "../../stores/imgs";
import { buildAuthorizationHeader } from "../../helpers/auth";

const imgsStorage = useImgs();
function isNewFileName(newName: string) {
  if (newName) {
    return newName + ".jpg";
  }
}
export async function addCertifcation(name: string, number: string, img: File) {
  const formData = new FormData();
  formData.append("file", img, isNewFileName(name + number));
  try {
    const response = await fetch(`${server_express_url}/upload-img-doc`, {
      method: "POST",
      body: formData,
      headers: {
        ...buildAuthorizationHeader(),
      },
    });

    if (response.ok) {
      let data: any = null;
      try {
        data = await response.json();
      } catch {
        // ignore
      }
      imgsStorage.refreshCertificationsReload;
      return {
        success: true,
        message: data?.message || "fileSuccess",
      } satisfies ActionResult;
    }

    let errorData: any = null;
    try {
      errorData = await response.json();
    } catch {
      // ignore
    }

    return {
      success: false,
      message: errorData?.message || errorData?.error || "unknownError",
    } satisfies ActionResult;
  } catch {
    return { success: false, message: "unknownError" } satisfies ActionResult;
  }
}
