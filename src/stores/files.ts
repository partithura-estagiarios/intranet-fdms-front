import { defineStore } from "pinia";
import { FileSystemItem } from "../entities/files";
import CreateFolder from "../graphql/folders/CreateFolder.gql";
import DeleteItem from "../graphql/folders/DeleteItem.gql";
import RenameFolder from "../graphql/folders/RenameFolder.gql";
const server_express_url = getEnvironmentVariable(
  "VITE_URL_BACK_SERVER_EXPRESS_FOR_ARCHIVES",
);
interface Message {
  enum: boolean;
  message: string;
}
interface State {
  folders: FileSystemItem[];
  currentPath: string;
  getFoldersAgain: boolean;
}
const id = "files";

export const useFiles = defineStore(id, {
  state: (): State => ({
    folders: [],
    currentPath: "",
    getFoldersAgain: false,
  }),
  getters: {
    foldersAgain: (state) => {
      return state.getFoldersAgain;
    },
    currentDirectoryContents: (state): FileSystemItem[] => {
      if (!state.currentPath) {
        return state.folders;
      }

      const findNodeByPath = (
        nodes: FileSystemItem[],
        targetPath: string,
      ): FileSystemItem | undefined => {
        for (const node of nodes) {
          if (node.path === targetPath) {
            return node;
          }
          if (node.children && node.children.length > 0) {
            const found = findNodeByPath(node.children, targetPath);
            if (found) {
              return found;
            }
          }
        }
        return undefined;
      };

      const currentFolder = findNodeByPath(state.folders, state.currentPath);

      return currentFolder && currentFolder.children
        ? currentFolder.children
        : [];
    },
  },
  actions: {
    setAllFolders(folders: FileSystemItem[]) {
      this.folders = folders;
    },

    navigateTo(path: string) {
      this.currentPath = path;
    },

    navigateUp() {
      if (this.currentPath.includes("/")) {
        this.currentPath = this.currentPath.substring(
          0,
          this.currentPath.lastIndexOf("/"),
        );
        return;
      }
      this.currentPath = "";
    },

    resetSelectedFields() {
      this.currentPath = "";
    },

    displayPdf(filePath: string) {
      const pdfUrl = `${server_express_url}/serve-pdf/${filePath}`;
      window.open(pdfUrl, "_blank");
    },

    async insertFolder(path: string, folderName: string) {
      const { createFolder }: { createFolder: Message } = await runMutation(
        CreateFolder,
        { folder: folderName, path: path },
      );
      if (createFolder.enum) {
        this.getFoldersAgain = true;
      }
      return {
        success: createFolder.enum,
        message: createFolder.message,
      };
    },

    async renameFolder(path: string, newName: string) {
      const { renameFolder }: { renameFolder: Message } = await runMutation(
        RenameFolder,
        { path, newName },
      );
      if (renameFolder.enum) {
        this.getFoldersAgain = true;
      }
      return {
        success: renameFolder.enum,
        message: renameFolder.message,
      };
    },

    async excludeItem(path: string) {
      const { deleteItem }: { deleteItem: Message } = await runMutation(
        DeleteItem,
        { path: path },
      );
      if (deleteItem.enum) {
        this.getFoldersAgain = true;
      }
      return {
        success: deleteItem.enum,
        message: deleteItem.message,
      };
    },

    async uploadFile(
      identifier: string,
      description: string,
      path: string,
      file: File,
      oldFileName?: string,
    ) {
      const formData = new FormData();

      formData.append("search-path", path);
      formData.append("identifier", identifier);
      formData.append("description", description);
      formData.append("file", file);
      if (oldFileName) {
        formData.append("old-file-name", oldFileName);
      }

      const response = await fetch(`${server_express_url}/upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        this.getFoldersAgain = true;
        return {
          success: true,
          message: data.message,
        };
      }

      const errorData = await response.json();
      return {
        success: false,
        message:
          errorData.message ||
          errorData.error ||
          "Erro desconhecido ao salvar arquivo",
      };
    },

    async editFile(path: string, identifier: string, description: string) {
      const response = await fetch(
        `${server_express_url}/update-pdf-metadata`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "search-path": path,
            identifier,
            description,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        this.getFoldersAgain = true;
        return {
          success: true,
          message: data.message,
        };
      }

      const errorData = await response.json();
      return {
        success: false,
        message:
          errorData.message ||
          errorData.error ||
          "Erro desconhecido ao editar arquivo",
      };
    },
  },
});
