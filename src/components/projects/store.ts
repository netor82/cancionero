import type { Project } from "@/core/interfaces/project";
import ProjectService from "@/core/services/project-service";
import { reactive } from "vue";


export const store = reactive({
    projects: [] as Project[],
    service: new ProjectService(),
    dateFormat: (date: Date) => new Intl.DateTimeFormat('default', { dateStyle: 'short', timeStyle: 'short' }).format(date),
})