import { notification } from "antd";

/**
 * Open up an Antd notification
 * @param {('error'|'warning'|'success')} type - The type of notification.
 * @param {string | import("react").ReactNode} message - The main error message. It's the notification title of the notification.
 * @param {string | import("react").ReactNode} description - The error description.
 */

const openNotification = (type, message, description = "") => {
    if (type !== "error" && type !== "warning" && type !== "success") return;

    notification[type]({
        message,
        description,
        placement: "bottomRight",
        duration: type === "error" ? 0 : 5,
    });
};

export default openNotification;
