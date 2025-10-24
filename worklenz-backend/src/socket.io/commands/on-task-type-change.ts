import {Server, Socket} from "socket.io";
import db from "../../config/db";
import {NotificationsService} from "../../services/notifications/notifications.service";
import {SocketEvents} from "../events";

import {getLoggedInUserIdFromSocket, log_error, notifyProjectUpdates} from "../util";
import {getTaskDetails, logNameChange} from "../../services/activity-logs/activity-logs.service";

export async function on_task_type_change(_io: Server, socket: Socket, data?: string) {
  try {
    const body = JSON.parse(data as string);
    const userId = getLoggedInUserIdFromSocket(socket);

    const task_type = (body.task_type || "Task").trim();
    const task_data = await getTaskDetails(body.task_id, "task_type");

    const q = `SELECT handle_task_type_change($1, $2, $3) AS response;`;

    const result = await db.query(q, [body.task_id, task_type, userId]);
    const [d] = result.rows;
    const response = d.response || {};

    for (const member of response.members || []) {
      if (member.user_id === userId) continue;
      NotificationsService.createNotification({
        userId: member.user_id,
        teamId: member.team_id,
        socketId: member.socket_id,
        message: response.message,
        taskId: body.task_id,
        projectId: response.project_id
      });
    }

    socket.emit(SocketEvents.TASK_TYPE_CHANGE.toString(), {
      id: body.task_id,
      parent_task: body.parent_task,
      task_type: response.task_type
    });
    notifyProjectUpdates(socket, body.task_id);

    logNameChange({
      task_id: body.task_id,
      socket,
      new_value: response?.task_type,
      old_value: task_data?.task_type
    });

  } catch (error) {
    log_error(error);
  }
}
