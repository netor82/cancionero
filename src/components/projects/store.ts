import type { Project } from "@/core/interfaces/project";
import projectService from "@/core/services/project-service";
import { reactive } from "vue";


export const store = reactive({
    projects: [] as Project[],
    service: projectService,
    dateFormat: (date: Date) => new Intl.DateTimeFormat('default', { dateStyle: 'short', timeStyle: 'short' }).format(date),
})