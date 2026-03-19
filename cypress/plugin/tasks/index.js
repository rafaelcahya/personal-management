import { authTasks } from "./authTasks.js";
import { tradeTasks } from "./tradeTasks.js";
import { feeTasks } from "./feeTasks.js";
import { eventTasks } from "./eventTasks.js";
import { productBrandTasks } from "./productBrandTasks.js";
import { productNameTasks } from "./productNameTasks.js";

export const registerTasks = (on, supabaseAdmin) => {
    on("task", {
        ...authTasks(supabaseAdmin),
        ...tradeTasks(supabaseAdmin),
        ...feeTasks(supabaseAdmin),
        ...eventTasks(supabaseAdmin),
        ...productBrandTasks(supabaseAdmin),
        ...productNameTasks(supabaseAdmin),
    });
};
