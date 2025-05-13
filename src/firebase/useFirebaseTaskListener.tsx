import { useRequest } from "ahooks";
import {
  collection,
  DocumentData,
  onSnapshot,
  QuerySnapshot,
} from "firebase/firestore";
import { useEffect } from "react";
import { useTasks } from "../task/task-context";
import { fireStore } from "./firebase";
import { getSubscribedTask } from "./query";

enum TaskActionType {
  CREATED = "CREATED",
  UPDATED = "UPDATED",
  DELETED = "DELETED",
}

interface FirebaseTask {
  actionType: TaskActionType;
  id: string;
  updatedAt: string;
}

export const useFirebaseTaskListener = () => {
  const { updateTask, addTasks } = useTasks();
  const { runAsync } = useRequest(getSubscribedTask, { manual: true });

  useEffect(() => {
    const tasksCollection = collection(fireStore, "tasks");

    // Listen to real-time changes in the "tasks" collection
    const unsubscribe = onSnapshot(
      tasksCollection,
      (snapshot: QuerySnapshot<DocumentData>) => {
        snapshot.docChanges().forEach((change) => {
          const data = change.doc.data() as FirebaseTask;
          if (!data || !data.actionType || !data.id) return;

          switch (data.actionType) {
            case TaskActionType.CREATED:
              runAsync(data.id).then((task) => {
                if (task) addTasks([task]);
              });
              break;

            case TaskActionType.UPDATED:
              runAsync(data.id).then((updatedTask) => {
                if (updatedTask) updateTask(updatedTask);
              });
              break;

            // Handle delete if necessary
            case TaskActionType.DELETED:
              // Optional: Add a `removeTask` method in context if needed
              break;

            default:
              break;
          }
        });
      },
      (error) => {
        console.error("Firestore listener error:", error);
      }
    );

    return () => {
      unsubscribe(); // Clean up listener on unmount
    };
  }, [addTasks, runAsync, updateTask]);
};
