export interface IConnector {
  isActive(): Promise<boolean>;
  activate(): Promise<void>;

  resumeCollection(): Promise<void>;
}
