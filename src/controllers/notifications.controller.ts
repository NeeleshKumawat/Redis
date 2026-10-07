import { Request, Response, NextFunction } from "express";
import { publishNotification } from "../subscribers/notifications.subscriber";

export async function publishNotificationController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { title, message } = req.body;

    // Validate the request body
    if (!title || !message) {
      return res.status(400).json({ error: "Title and message are required" });
    }

    // Create the notification payload
    const notificationPayload = {
      id: Date.now().toString(),
      title,
      message,
      createdAt: new Date().toISOString(),
    };

    // Publish the notification
    await publishNotification(notificationPayload);

    res.status(201).json({
      success: true,
      message: "Notification published successfully",
      data: {
        id: notificationPayload.id,
      },
    });
  } catch (error) {
    next(error);
  }
}
