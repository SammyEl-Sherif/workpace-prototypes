import { useFetch } from '@/hooks'
import { ProjectsRecord } from '@/pocketbase-types'

export const useProjects = (mock: boolean) => {
  // const [projects, isLoading, error, _, handleMakeRequest] = useFetch<ProjectsRecord[], null>(
  //   'pocketbase/collections/projects',
  //   { manual: true },
  //   null
  // )
  return [
    [
      {
        description: 'A collection of projects that I have worked on.',
        id: '1',
        thumbnail: 'https://via.placeholder.com/150',
        title: 'The Good Stuff List',
        url: '/good-stuff-list',
      },
      {
        description: 'A collection of projects that I have worked on.',
        id: '1',
        thumbnail: 'https://via.placeholder.com/150',
        title: 'The Good Stuff List',
        url: '/good-stuff-list',
      },
      {
        description: 'A collection of projects that I have worked on.',
        id: '1',
        thumbnail: 'https://via.placeholder.com/150',
        title: 'The Good Stuff List',
        url: '/good-stuff-list',
      },
      {
        description: 'A collection of projects that I have worked on.',
        id: '1',
        thumbnail: 'https://via.placeholder.com/150',
        title: 'The Good Stuff List',
        url: '/good-stuff-list',
      },
      {
        description: 'A collection of projects that I have worked on.',
        id: '1',
        thumbnail: 'https://via.placeholder.com/150',
        title: 'The Good Stuff List',
        url: '/good-stuff-list',
      },
      {
        description: 'A collection of projects that I have worked on.',
        id: '1',
        thumbnail: 'https://via.placeholder.com/150',
        title: 'The Good Stuff List',
        url: '/good-stuff-list',
      },
    ] as ProjectsRecord[],
    false,
    false,
  ] as const

  // return [projects ?? null, isLoading, error] as const
}
