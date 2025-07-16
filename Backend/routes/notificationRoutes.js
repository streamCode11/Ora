import express from "express";
import { getUserNotifications, markAsRead } from "../controllers/notification.controller.js";
const notificationRouter = express.Router();

notificationRouter.get('/:userId' , getUserNotifications );
notificationRouter.patch('/:notificationId/read' , markAsRead );

export default notificationRouter;