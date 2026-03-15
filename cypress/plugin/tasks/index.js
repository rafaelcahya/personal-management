import { authTasks } from "./authTasks.js";
import { tradeTasks } from "./tradeTasks.js";
import { feeTasks } from "./feeTasks.js";

export const registerTasks = (on, supabaseAdmin) => {
    on("task", {
        ...authTasks(supabaseAdmin),
        ...tradeTasks(supabaseAdmin),
        ...feeTasks(supabaseAdmin),
    });
};
