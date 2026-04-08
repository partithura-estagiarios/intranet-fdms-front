import { defineStore } from "pinia";

export const server_express_url = getEnvironmentVariable(
  "VITE_URL_BACK_SERVER_EXPRESS_FOR_ARCHIVES",
);

import CreateFolderForInt from "../graphql/institutionalImgs/CreateFolderForInt.gql";
import ExcludeFolderForInt from "../graphql/institutionalImgs/ExcludeFolderForInt.gql";
import ExcludeFolderForCertification from "../graphql/certification/ExcludeFolderForCertification.gql";

interface Message {
  enum: boolean;
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
    async insertImg(path: string, file: any) {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(`${server_express_url}/upload-img`, {
        method: "POST",
        body: formData,
        headers: {
          "search-path": path,
        },
      });
      if (response.ok) {
        this.refreshReload;
        return true;
      }
      return false;
    },
    async insertFolder(folderName: string) {
      const { createFolderForInt }: { createFolderForInt: Message } =
        await runMutation(CreateFolderForInt, {
          folder: folderName,
        });
      return createFolderForInt;
    },
    async excludeImgInstitutional(path: string) {
      try {
        const response = await runMutation(ExcludeFolderForInt, {
          folder: path,
        });
        if (response) {
          this.refreshReload;
          return true;
        }
        return false;
      } catch (error) {
        return false;
      }
    },
    async deleteFolderInstitutional(folderName: string) {
      try {
        const response = await runMutation(ExcludeFolderForInt, {
          folder: folderName,
        });
        if (response) {
          this.refreshReload;
          return true;
        }
        return false;
      } catch (error) {
        return false;
      }
    },
    async excludeFolder(path: string) {
      await runMutation(ExcludeFolderForInt, { folder: path });
      this.refreshReload;
    },
    async excludeCertification(path: string) {
      await runMutation(ExcludeFolderForCertification, {
        folder: path,
      });
      this.refreshCertificationsReload;
    },
  },
});
