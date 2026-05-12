export interface Notification {
  id: string;
  type: "complaint" | "feedback";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}
