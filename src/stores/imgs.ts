import { defineStore } from "pinia";

export const server_express_url = getEnvironmentVariable(
  "VITE_URL_BACK_SERVER_EXPRESS_FOR_ARCHIVES",
);

import CreateFolderForInt from "../graphql/institutionalImgs/CreateFolderForInt.gql";
import ExcludeFolderForInt from "../graphql/institutionalImgs/ExcludeFolderForInt.gql";
import ExcludeFolderForCertification from "../graphql/certification/ExcludeFolderForCertification.gql";
import { buildAuthorizationHeader } from "../helpers/auth";

interface Message {
  enum: boolean;
  message: string;
}

export interface ActionResult {
  success: boolean;
  message: string;
}

interface State {
  folders: string[];
  reload: boolean;
  certifications: string[];
  reloadCertification: boolean;
}

export const useImgs = defineStore("imgs", {
  state: (): State => ({
    folders: [],
    certifications: [],
    reload: false,
    reloadCertification: false,
  }),
  getters: {
    refreshReload(state) {
      return (state.reload = !state.reload);
    },
    refreshCertificationsReload(state) {
      return (state.reloadCertification = !state.reloadCertification);
    },
  },
  actions: {
    setFoldersImgs(folderName: string[]) {
      this.folders = [...folderName];
    },
    setFoldersCertifications(folderName: string[]) {
      this.certifications = [...folderName];
    },
    async insertImg(path: string, file: File): Promise<ActionResult> {
      try {
        const formData = new FormData();
        formData.append("search-path", path);
        formData.append("file", file);

        const baseUrl = import.meta.env.DEV ? "" : server_express_url;

        const response = await fetch(`${baseUrl}/upload-img`, {
          method: "POST",
          body: formData,
          headers: {
            ...buildAuthorizationHeader(),
            "search-path": path,
          },
        });

        if (response.ok) {
          let data: any = null;
          try {
            data = await response.json();
          } catch {
            // ignore
          }
          this.refreshReload;
          return {
            success: true,
            message: data?.message || "fileSuccess",
          };
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
        };
      } catch {
        return { success: false, message: "unknownError" };
      }
    },

    async insertFolder(folderName: string): Promise<ActionResult> {
      try {
        const { createFolderForInt }: { createFolderForInt: Message } =
          await runMutation(CreateFolderForInt, {
            folder: folderName,
          });

        if (createFolderForInt.enum) {
          this.refreshReload;
        }

        return {
          success: createFolderForInt.enum,
          message: createFolderForInt.message,
        };
      } catch {
        return { success: false, message: "unknownError" };
      }
    },

    async excludeImgInstitutional(path: string): Promise<ActionResult> {
      try {
        const { excludeFolderForInt }: { excludeFolderForInt: Message } =
          await runMutation(ExcludeFolderForInt, {
            folder: path,
          });

        if (excludeFolderForInt.enum) {
          this.refreshReload;
        }

        return {
          success: excludeFolderForInt.enum,
          message: excludeFolderForInt.message,
        };
      } catch {
        return { success: false, message: "unknownError" };
      }
    },

    async deleteFolderInstitutional(folderName: string): Promise<ActionResult> {
      return this.excludeImgInstitutional(folderName);
    },

    async excludeFolder(path: string): Promise<ActionResult> {
      return this.excludeImgInstitutional(path);
    },

    async excludeCertification(path: string): Promise<ActionResult> {
      try {
        const {
          excludeFolderForCertification,
        }: { excludeFolderForCertification: Message } = await runMutation(
          ExcludeFolderForCertification,
          {
            folder: path,
          },
        );

        if (excludeFolderForCertification.enum) {
          this.refreshCertificationsReload;
        }

        return {
          success: excludeFolderForCertification.enum,
          message: excludeFolderForCertification.message,
        };
      } catch {
        return { success: false, message: "unknownError" };
      }
    },
  },
});
