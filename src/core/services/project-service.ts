import _const from '../enums/const';
import type { Project, ProjectDTO } from '../interfaces/project';
import { deepToRaw } from '../utils/deepToRaw';
import BaseDbService, { StoreName } from './basedb-service';

class ProjectService extends BaseDbService {
    private static instance: ProjectService

    private constructor() {
        super(StoreName.PROJECTS)
    }

    static getInstance(): ProjectService {
        if (!ProjectService.instance) ProjectService.instance = new ProjectService()
        return ProjectService.instance;
    }

    async add(title: string): Promise<Project> {
        const date = new Date()
        var project = { id: date.getTime(), title, date, songs:[] } as Project;
        await this.saveOperation(project)
        return project
    }

    async getAll(): Promise<Project[]> {
        return this.readOnlyOperation<Project[]>((objectStore) => {
            return objectStore.getAll()
        });
    }

    async save(project: Project): Promise<void> {
        const clone = deepToRaw(project)
        clone.date = new Date() // Updated
        project.date = clone.date
        await this.saveOperation(clone)
    }

    async clone(project: Project): Promise<Project> {
        let clone = deepToRaw(project)
        clone.date = new Date()
        clone.id = clone.date.getTime()
        clone.title += '*'
        await this.saveOperation(clone);
        return clone;
    }

    async delete(project: Project): Promise<void> {
        await this.deleteOperation(project.id);
    }

    async export(project: Project): Promise<ProjectDTO> {
        let dto = await this.toDTO(project);

        // create a file to the user and show it as download
        const blob = new Blob([JSON.stringify([dto])], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `project-${project.title}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return dto;
    }

    async import(file: File): Promise<Project> {
        const text = await file.text();
        const dto = JSON.parse(text) as ProjectDTO[];
        const project = this.fromDTO(dto[0])
        this.save(project)
        return project
    }

    private toDTO(project: Project): ProjectDTO {
        return {
            d: project.date.getTime(),
            t: project.title,
            s: project.songs.map(song => ({
                s: song.id,
                t: song.transpose
            }))
        };
    }

    private fromDTO(dto: ProjectDTO): Project {
        return {
            id: new Date().getTime(),
            title: dto.t,
            date: new Date(dto.d),
            songs: dto.s.map(song => ({
                id: song.s,
                transpose: song.t
            }))
        }
    }
}

export default ProjectService.getInstance()
