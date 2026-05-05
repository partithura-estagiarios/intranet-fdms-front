export interface FileSystemItem {
  name: string;
  identifier?: string | undefined;
  description?: string | undefined;
  path: string;
  type: string;
  children: FileSystemItem[];
}
